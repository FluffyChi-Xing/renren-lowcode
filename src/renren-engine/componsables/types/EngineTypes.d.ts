/**
 * @description 引擎类型模块
 * @author FluffyChi-Xing
 */


declare namespace EngineTypes {


  type WindowProxy = Window;

  /**
   * @description 基础沙箱类型
   */
  interface ISandbox {
    name: string; // 沙箱名称
    type: string; // 晒想类型
    proxy: WindowProxy; // 沙箱导出的代理实体
    isRunning: boolean; // 运行标识
    latestSetProp?: PropertyKey | null; // 最新设置的属性
    patchDocument: (doc: Document) => void; // 挂载到 document 上的沙箱方法
  }

  type FakeWindow = Window & Record<PropertyKey, any>;

  type SymbolTarget = 'target' | 'globalContext';

  interface createWindowType {
    fakeWindow: FakeWindow;

    propertiesWithGetter: Map<PropertyKey, boolean>;
  }
}
