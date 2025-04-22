/**
 * @description   基于 proxy 实现的 js sandbox
 * @author FluffyChi-Xing
 */
import type {EngineTypes} from "@/renren-engine/componsables/types/EngineTypes";
import {SandboxTypeEnum} from "@/renren-engine/componsables/enums/EngineEnums";
import {IN_TEST, MOCK_SAFARI_TOP, MOCK_TOP} from "@/renren-engine/componsables/constants/EngineConstants";
import * as process from "process";


let activeSandboxCount: number = 0;


/**
 * @description 全局白名单变量列表
 */
const globalVariableWhiteList: string[] = [
  'System',
  '__cjsWrapper',
];


/**
 * @description 创建伪造 window 对象，并返回该对象及其所有包含 getter 方法的属性映射表
 * @param context
 * @param speedy
 */
function createFakeWindow(context: Window, speedy: boolean): EngineTypes.createWindowType {
  const propertiesWithGetter = new Map<PropertyKey, boolean>();
  const fakeWindow = {} as EngineTypes.FakeWindow;

  // 获取所有不可配置的属性
  Object.getOwnPropertyNames(context).filter(key => {
    const descriptor = Object.getOwnPropertyDescriptor(context, key);
    // 只保留不可配置的属性
    return !descriptor?.configurable;
  }).forEach((key: string) => {
    const descriptor = Object.getOwnPropertyDescriptor(context, key);
    // 保存属性的 getter 方法
    if (descriptor) {
      const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');
      if (
        key === 'top' ||
        key === 'parent' ||
        key === 'self' ||
        key === 'window' ||
        (key === 'document' && speedy) ||
        (IN_TEST && (key === MOCK_TOP || key === MOCK_SAFARI_TOP))
      ) {
        descriptor.configurable = true;

        if (!hasGetter) {
          descriptor.writable = true;
        }
      }


      // 如果有 getter 方法，则保存该属性
      if (hasGetter) {
        propertiesWithGetter.set(key, true);
      }

      /**
       * @description 将 fake-window 上所有 属性，并保存到 fake-window 上，并冻结 该属性，防止被修改
       */
      Object.defineProperty(fakeWindow, key, Object.freeze(descriptor));
    }
  });


  return {
    fakeWindow,
    propertiesWithGetter
  };
}


/**
 * @description 基于代理的 js-sandbox 实现
 */
export default class ProxySandbox implements EngineTypes.ISandbox {
  isRunning: boolean = false;
  latestSetProp: PropertyKey | null = null;
  name: string = '';
  proxy: EngineTypes.WindowProxy = window;
  type: SandboxTypeEnum = SandboxTypeEnum.PROXY;
  private updateValueSet: Set<PropertyKey> = new Set<PropertyKey>();
  private document: Document = document;
  patchDocument(doc: Document): void {
    this.document = doc;
  }

  globalWhitePrevDescriptor: { [P in (typeof globalVariableWhiteList)[number]]: PropertyDescriptor | undefined } = {};

  globalContext: typeof window;


  /**
   * @description 启动沙箱
   */
  active(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        if (!this.isRunning) activeSandboxCount ++;
        this.isRunning = true;
        resolve('沙箱启动成功');
      } catch (e) {
        console.error('沙箱启动失败', e);
        reject('沙箱启动失败');
      }
    });
  }



  inactive(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        // 如果当前为 dev 环境，则打印出当前 sandbox 中被修改的全局属性
        if (process.env.NODE_ENV === 'development') {
          console.info(`[renren:engine] ${this.name} modified global properties restore ...`, [
            ...this.updateValueSet.keys(),
          ]);
        }
        // 如果当前沙箱为空 || 为 test 环境 则还原全局变量
        if (IN_TEST || --activeSandboxCount === 0) {
          Object.keys(this.globalWhitePrevDescriptor).forEach((key: string) => {
            const descriptor = this.globalWhitePrevDescriptor[key];
            if (descriptor) {
              Object.defineProperty(this.globalContext, key, descriptor);
            } else {
              delete this.globalContext[key as unknown as number];
            }
          });
        }

        this.isRunning = false;

        resolve('沙箱关闭成功');
      } catch (e) {
        console.error('沙箱关闭失败', e);
        reject('沙箱关闭失败');
      }
    });
  }



  constructor(
    name: string,
    globalContext = window,
    opts?: {
      speedy: boolean
    }
  ) {
    this.name = name;
    this.globalContext = globalContext;
    const { speedy } = opts || {};
    const { updateValueSet } = this;
    const { fakeWindow, propertiesWithGetter } = createFakeWindow(globalContext, !!speedy);
    // 属性描述符映射表
    const descriptorTargetMap = new Map<PropertyKey, EngineTypes.SymbolTarget>();

    const proxy = new Proxy(fakeWindow, {
      set: (target, p, newValue, receiver): boolean =>{
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[renren:engine] Set window.${p.toString()} while sandbox destroyed or inactive i ${this.name}!`);
        }

        if (this.isRunning) {
          // TODO: 注册正在运行的应用
          // this.registerRunningApp(this.name, proxy);
        }

        updateValueSet.add(p);
        this.latestSetProp = p;
        return true;
      },

      get: () => {

      },

      has: (target: EngineTypes.FakeWindow, p: string | number | symbol): boolean => {
        return true;
      },

      getOwnPropertyDescriptor: (target: EngineTypes.FakeWindow, p: string | number | symbol): PropertyDescriptor => {
        return {};
      },

      ownKeys: (target: EngineTypes.FakeWindow): ArrayLike<string | symbol> => {
        return [];
      },

      defineProperty: (target: Window, property: PropertyKey, attributes: PropertyDescriptor): boolean => {
        return true;
      },

      deleteProperty: (target: EngineTypes.FakeWindow, p: string | number | symbol): boolean => {
        return true;
      },

      getPrototypeOf: () => {
        return Reflect.getPrototypeOf(globalContext);
      }
    });

    this.proxy = proxy;

    activeSandboxCount ++;
  }


  // private registerRunningApp(name: string, proxy: Window) {
  //   if (this.isRunning) {
  //     const currentRunningApp = getCurrentRunningApp();
  //     if (!currentRunningApp || currentRunningApp?.name !== name) {
  //       setCurrentRunningApp({
  //         name,
  //         window: proxy
  //       });
  //     }
  //
  //     nextTask(clearCurrentRunningApp);
  //   }
  // }
}
