/**
 * @description 插件实体类 模块
 * @author FluffyChi-Xing
 */
import type {PluginApiInterface} from "@/componsables/interface/PluginApiInterface";
import type { App } from 'vue';



export class IPlugin implements PluginApiInterface.IPluginPublicApi{
  // 插件的相关配置项列表，使用 pluginName: any 的方式存储
  options?: Set<Record<string, PluginApiInterface.PluginOptionsType>>;

  // 已经注册的插件
  private registeredPlugins: PluginApiInterface.IPluginType[] = [];

  // 删除某个插件
  delete(name: string): void {
  }

  // 获取某个插件
  get(name: string): PluginApiInterface.PluginCompType | null | undefined {
    return this.registeredPlugins.filter(item => item.name === name)[0].component;
  }

  // 获取所有已经注册的插件
  getAll(): PluginApiInterface.PluginCompType[] | null | undefined {
    let result: PluginApiInterface.PluginCompType[] = [];
    this.registeredPlugins.forEach((item: PluginApiInterface.IPluginType) => {
      result.push(item.component);
    });
    return result;
  }

  // 判断是否存在某个已经注册的插件
  has(name: string): boolean {
    return this.registeredPlugins.filter(plugin => plugin.name === name).length > 0;
  }

  // 初始化插件
  install(app: App): void {

    // 遍历已经注册的组件列表
    // 将组件注册到 app.component 中
    this.registeredPlugins.forEach((plugin: PluginApiInterface.IPluginType) => {
      app.component(plugin.name, plugin.component);
    });

    app.provide('plugin', {
      // 通过 $pluginGet 获取组件
      pluginGet: (name: string) => this.get(name),
      // 通过 $pluginAll 获取全部已经注册的组件列表
      pluginAll: this.getAll(),
      // 通过 $pluginHas 判断某个组件是否已经注册
      pluginHas: (name: string) => this.has(name),
      // 通过 $pluginDel 删除某个已经注册的组件
      pluginDel: (name: string) => this.delete(name),
      // 通过 $pluginPre 获取组件的配置项
      pluginPre: (name: string) => this.getPreference(name),
    });
    console.log("[Plugin]", "Registered plugin");
  }

  // 注册插件
  register(pluginModel: PluginApiInterface.IPluginType, options?: Record<string, PluginApiInterface.PluginOptionsType>, registerOptions?: PluginApiInterface.PluginRegisterOptionsType): void {
    const { name, component } = pluginModel;
    // 是否自动注册组件,默认 true
    let init: boolean = true;
    // 是否允许注册的时候覆盖同名组件，默认false
    let ride: boolean = false;
    // 组件的额外属性
    let pluginOptions: Record<string, any> = {};
    try {
      // 检查注册参数
      if (registerOptions) {
        const { autoInit, override } = registerOptions;
        // 是否自动注册组件,默认 true
        init = autoInit !== void 0 ? autoInit : true;
        // 是否允许注册的时候覆盖同名组件，默认false
        ride = override !== void 0 ? override : false;
        // 是否启用自动注册组件,默认 true
        if (!init) {
          console.error(`未开启自动注册, 组件 [${name}] 未注册`);
        }
      }
      // 检查组件是否已经注册
      // 如果已经注册过同名组件，并且 override 为 false，则不允许注册
      if (this.has(name) && !ride) {
        console.error('插件已存在');
      }
      // 检查组件的额外参数
      if (options) {
        for (let key in options) {
          pluginOptions[key] = options[key];
        }
        // 2、将组件的相应属性添加到 options 中
        this.options?.add(options);
      }
      // 执行组件注册流程
      // 1、将组件添加到列表中
      this.registeredPlugins.push({
        name: name,
        component: component,
      });
      console.log(`注册组件 [${name}] 成功`);
    } catch (e) {
      console.error(`注册插件 [${name}] 失败`, e);
    }
  }

  // 获取组件配置项
  getPreference(name: string): any | null | undefined {
    this.options?.forEach((plugin: Record<string, any>) => {
      return plugin[name];
    });
  }
}



// 创建插件实例
export function createPlugin(): IPlugin {
  return new IPlugin();
}



