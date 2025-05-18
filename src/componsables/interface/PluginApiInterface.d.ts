/**
 * @description 插件接口模块
 * @author FluffyChi-Xing
 */
import type {App, DefineComponent} from "vue";
import {IPlugin} from "@/componsables/models/PluginModel";


declare namespace PluginApiInterface {



  type PluginOptionsType = string | number | boolean | object;


  type PluginMetaType = string | number | boolean | object;


  type PluginCompType = DefineComponent<{}, {}, any>;


  type PluginRegisterOptionsType = {
    // 开启自动初始化
    autoInit?: boolean;
    // 是否可以用同名的其他组件对原有组件进行复写
    override?: boolean;
  };


  type PluginPreferenceType = string | number | boolean;


  /**
   * @description 基础插件类型
   */
  interface IPluginType {
    // plugin name
    name: string;
    // plugin component
    component: PluginCompType;
  }


  /**
   * @description 基础插件api类型
   */
  interface IPluginPublicApi {
    // 组件的额外属性
    options?: Set<Record<string, PluginOptionsType>>;

    // 注册组件
    register(pluginModel: IPluginType, options?: Record<string, PluginOptionsType>, registerOptions?: PluginRegisterOptionsType): void;

    // 根据 name 获取对应的组件实例
    get(name: string): PluginCompType | undefined;

    // 获取注册的全部组件实例
    getAll(): PluginCompType[] | null | undefined;

    // 检查是否存在某个实例
    has(name: string): boolean;

    // 删除某个实例
    delete(name: string): void;

    // install 函数，为了在main.js 中通过 vue.use 安装 plugin
    install(app: App): void;

    // 获取组件对应的配置项
    getPreference(name: string): any | null | undefined;
  }


  interface IPluginFuncType {
    // 获取组件实例
    pluginGet: (name: string) => PluginCompType | unknown;
    // 获取全部组件实例
    pluginAll: PluginCompType[] | null | unknown;
    // 判断组件是否注册
    pluginHas: (name: string) => boolean;
    // 删除组件实例
    pluginDel: (name: string) => void;
    // 获取组件配置项
    pluginPre: (name: string) => any | null | unknown;
  }
}
