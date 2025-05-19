/**
 * @description 引擎类型模块
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";


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


  type DocumentCoreAttr = {
    rootNode: boolean;
    fileName: string | null;
  };

  type MaterialCoreAttr = {
    fileName: string;
    type: string;
  };


  /**
   * @description 节点统一属性规范类型
   */
  type BaseElement = {
    // page nodes or material children
    nodes: MaterialInterface.IMaterial[];
    // prop attributes
    prop: MaterialInterface.IProp[];
    // other attributes
    meta: DocumentCoreAttr | MaterialCoreAttr | undefined;
    // events
    events: RenrenInterface.IEvent[];
    // animation
    animation: RenrenInterface.keyValueType<string>[];
  };



  // 代码转换中间结构
  type tempGenerateStructure = {
    page: BaseElement | undefined;
    material: BaseElement[];
  };
}
