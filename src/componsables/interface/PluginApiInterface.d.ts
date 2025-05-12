/**
 * @description 插件接口模块
 * @author FluffyChi-Xing
 */
import type {DefineComponent} from "vue";


export namespace PluginApiInterface {



  export declare type PluginOptionsType = string | number | boolean | object;


  export declare type PluginMetaType = string | number | boolean | object;


  export declare type PluginCompType = DefineComponent<{}, {}, any>;


  export declare type PluginRegisterOptionsType = {
    // 开启自动初始化
    autoInit?: boolean;
    // 是否可以用同名的其他组件对原有组件进行复写
    override?: boolean;
  };


  export declare type PluginPreferenceType = string | number | boolean;


  /**
   * @description 基础插件类型
   */
  export interface IPluginType {
    // plugin name
    name: string;
    // plugin meta
    meta?: Record<string, PluginMetaType>;
    // plugin component
    component: PluginCompType;
  }


  /**
   * @description 基础插件api类型
   */
  export interface IPluginPublicApi {
    [key: string]: any;

    // 注册组件
    register(pluginModel: IPluginType, options?: Record<string, PluginOptionsType>, registerOptions?: PluginRegisterOptionsType): Promise<void>;

    // 获取组件的相应配置信息
    getPluginPreference(): Record<string, PluginPreferenceType> | null | undefined;

    // 根据 name 获取对应的组件实例
    get(name: string): PluginCompType | null | undefined;

    // 获取注册的全部组件实例
    getAll(): PluginCompType[] | null | undefined;

    // 检查是否存在某个实例
    has(name: string): boolean;

    // 删除某个实例
    delete(name: string): void;
  }
}
