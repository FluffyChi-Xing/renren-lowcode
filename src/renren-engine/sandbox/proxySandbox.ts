/**
 * @description   基于 proxy 实现的 js sandbox
 * @author FluffyChi-Xing
 */
import {rebindTarget2Fn} from "../sandbox/commonSandbox";
import {SandboxTypeEnum} from "../componsables/enums/EngineEnums";


let activeSandboxCount: number = 0;


/**
 * @description 检查属性是否为可配置的
 * @param target
 * @param prop
 */
function isPropConfigurable(target: WindowProxy, prop: PropertyKey): boolean | undefined {
  // 获取属性描述符
  const descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}


/**
 * @description 基于代理的 js-sandbox 实现
 */
export default class ProxySandbox implements EngineTypes.ISandbox {
  isRunning: boolean = true;
  latestSetProp: PropertyKey | null = null;
  name: string;
  proxy: WindowProxy;
  type: 'proxy';
  private document: Document = document;
  // 沙箱新增的全局变量 map
  private addedPropsMapInSandbox: Map<PropertyKey, any> = new Map<PropertyKey, any>();
  // 记录更新的（新增和修改的）全局变量的 map,用于在任意时刻做 snapshot
  private currentUpdatePropsValueMap: Map<PropertyKey, any> = new Map<PropertyKey, any>();
  // 沙箱期间更新的全局变量
  private modifiedPropsOriginalValueMapInSandbox: Map<PropertyKey, any> = new Map<PropertyKey, any>();
  patchDocument(doc: Document): void {
    this.document = doc;
  }

  // globalWhitePrevDescriptor: { [P in (typeof globalVariableWhiteList)[number]]: PropertyDescriptor | undefined } = {};

  globalContext: typeof window;


  /**
   * @description 启动沙箱
   */
  active(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        if (!this.isRunning) {
          // 激活沙箱标记自增
          activeSandboxCount ++;
          // 从保存的已更新属性表中取出属性添加到全局变量上
          this.currentUpdatePropsValueMap.forEach((value: any, prop: PropertyKey) => {
            this.setWindowProp(prop, value);
          })
        }
        this.isRunning = true;
        resolve('沙箱启动成功');
      } catch (e) {
        console.error('沙箱启动失败', e);
        reject('沙箱启动失败');
      }
    });
  }



  inactive(type: string = 'test'): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        // 如果当前为 dev 环境，则打印出当前 sandbox 中被修改的全局属性
        if (type === 'dev') {
          console.info(`[renren:engine] ${this.name} modified global properties restore ...`, [
            ...this.addedPropsMapInSandbox.keys(),
            ...this.modifiedPropsOriginalValueMapInSandbox.keys(),
          ]);
        }
        this.modifiedPropsOriginalValueMapInSandbox.forEach((value: any, prop: PropertyKey) => {
          this.setWindowProp(prop, value);
        });
        this.addedPropsMapInSandbox.forEach((_: any, prop: PropertyKey) => {
          // 从全局变量上删除在沙盒期间添加的属性
          this.setWindowProp(prop, undefined, true);
        });

        this.isRunning = false;
        resolve('沙箱关闭成功');
      } catch (e) {
        console.error('沙箱关闭失败', e);
        reject('沙箱关闭失败');
      }
    });
  }


  /**
   * @description 设置全局变量属性
   * @param prop
   * @param value
   * @param toDelete
   * @private
   */
  private setWindowProp(prop: PropertyKey, value: any, toDelete?: boolean) {
    // 如果属性不存在 并且 toDelete 为 true 则之间从全局变量中删除该属性
    if (value === void 0 && toDelete) {
      delete (this.globalContext as any)[prop];
    } else if (typeof prop !== 'symbol' && isPropConfigurable(this.globalContext, prop)) {
      // 如果属性的类型不是 symbol 且属性是可配置的，则进行赋值
      (this.globalContext as any)[prop] = value;
    }
  }



  constructor(
    name: string,
    globalContext = window,
  ) {
    this.name = name;
    this.globalContext = globalContext;
    const { addedPropsMapInSandbox, modifiedPropsOriginalValueMapInSandbox, currentUpdatePropsValueMap } = this;
    const rawWindow = globalContext;
    this.type = SandboxTypeEnum.PROXY;
    const fakeWindow = Object.create(null) as Window;
    // 属性描述符映射表
    // const descriptorTargetMap = new Map<PropertyKey, EngineTypes.SymbolTarget>();
    /**
     * @description 设置代理的 set 拦截器
     * @param prop
     * @param value
     * @param originalValue
     * @param sync2Window
     * @param type
     */
    const setTrap = (prop: PropertyKey, value: any, originalValue: any, sync2Window: boolean = true, type: string = 'test'): boolean => {
      if (this.isRunning) {
        // 如果 globalContext 上不存在该属性，那么就添加到沙盒期间的属性-值对应表中
        if (!rawWindow.hasOwnProperty(prop)) {
          addedPropsMapInSandbox.set(prop, value);
        } else if (!modifiedPropsOriginalValueMapInSandbox.has(prop)) {
          // 如果该属性也不存在于沙盒期间被修改的属性-值对应表中，那么就添加到沙盒期间被修改的属性-值对应表中
          modifiedPropsOriginalValueMapInSandbox.set(prop, originalValue);
        }

        // 总是将属性存在在沙盒期间更新的属性-值对应表中
        currentUpdatePropsValueMap.set(prop, value);

        // 如果需要与 globalContext 同步，则进行同步
        if (sync2Window) {
          (rawWindow as any)[prop] = value;
        }

        this.latestSetProp = prop;

        return true;
      }

      if (type === 'development') {
        console.warn(`[renren:engine] Set window.${prop.toString()} while sandbox destroyed or inactive in ${name}.`)
      }
      return true;
    };

    const proxy = new Proxy(fakeWindow, {
      set: (_: Window, prop: PropertyKey, value: any): boolean => {
        // 获取属性的原始值
        const originalValue = (rawWindow as any)[prop];
        // 设置属性
        return setTrap(prop, value, originalValue, true, 'test');
      },

      get: (_: Window, prop: PropertyKey): any => {
        // 防止使用 window.window || window.parent || window.self 等逃逸出 sandbox 环境
        // 或使用 window.top 检查是否是一个 iframe context
        if (
          prop === 'top' ||
          prop === 'parent' ||
          prop === 'window' ||
          prop === 'self'
        ) {
          return proxy;
        }

        const value = (rawWindow as any)[prop];

        // 将值绑定在全局变量上
        return rebindTarget2Fn(rawWindow, value);
      },

      has: (_: EngineTypes.FakeWindow, prop: string | number | symbol): boolean => {
        return prop in rawWindow;
      },

      getOwnPropertyDescriptor: (_: EngineTypes.FakeWindow, prop: string | number | symbol): PropertyDescriptor | undefined => {
        // 获取属性对应的属性描述符
        const descriptor = Object.getOwnPropertyDescriptor(rawWindow, prop);
        if (descriptor && !descriptor.configurable) {
          // 如果属性不可配置，则设置为可配置的
          descriptor.configurable = true;
        }
        return descriptor;
      },

      defineProperty: (_: Window, prop: PropertyKey, attributes: PropertyDescriptor): boolean => {
        const originalValue: any = (rawWindow as any)[prop];
        // 对全局对象的 prop 属性设置/修改 attributes 值
        const done = Reflect.defineProperty(rawWindow, prop, attributes);
        const value = (rawWindow as any)[prop];
        setTrap(prop, value, originalValue, false, 'test');

        return done;
      },

      getPrototypeOf: () => {
        return Reflect.getPrototypeOf(rawWindow);
      }
    });

    this.proxy = proxy;
  }
}
