/**
 * @description 引擎类型模块
 * @author FluffyChi-Xing
 */


export namespace EngineTypes {


  export type WindowProxy = Window;

  /**
   * @description 基础沙箱类型
   */
  export interface ISandbox {
    name: string; // 沙箱名称
    type: string; // 晒想类型
    proxy: WindowProxy; // 沙箱导出的代理实体
    isRunning: boolean; // 运行标识
    latestSetProp?: PropertyKey | null; // 最新设置的属性
    patchDocument: (doc: Document) => void; // 挂载到 document 上的沙箱方法
  }

  export type FakeWindow = Window & Record<PropertyKey, any>;

  export type SymbolTarget = 'target' | 'globalContext';

  export interface createWindowType {
    fakeWindow: FakeWindow;

    propertiesWithGetter: Map<PropertyKey, boolean>;
  }
}
