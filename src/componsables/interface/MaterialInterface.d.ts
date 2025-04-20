/**
 * @description 物料 interface 模块
 * @author FluffyChi-Xing
 */
import { RenrenEntity } from "@/componsables/entities/RenrenEntity";
import {RenrenInterface} from "@/componsables/interface/RenrenInterface";


export namespace MaterialInterface {


  /**
   * @description 基础物料类型
   */
  export interface IMaterial {
    isNode: boolean; // 是否是节点
    title: string;
    isLocked: boolean;
    condition: string; // 物料状态
    conditionGroup: string; // 物料状态组
    hidden: boolean; // 是否隐藏
    id: string; // 物料 ID
    children?: IMaterial[] | null; // 物料子项
    parent?: string | null; // 物料父项
    zLevel: number; // 物料层级
    props?: IProps | null; // 物料属性
    icon?: string | null; // 物料图标
    animation?: RenrenInterface.keyValueType<string>[] | undefined; // 物料动画
  }


  /**
   * @description 物料基础属性类型
   */
  export interface IProps {
    id: string;
    items: IProp[] | null;
    owner: string | null;
    maps: Map<string, IProp> | undefined;
    type: string;
    size: number;
  }


  /**
   * @description 子物料项类型
   */
  export interface INodeChildren {
    children: IMaterial[];
    owner: IMaterial | null;
    size: number;
  }


  export interface IProp {
    items: IProp[] | null;
    maps: Map<string, IProp> | undefined;
    code: string;
    key: string;
    value: any;
    type: string;
    owner: string | null,
    parent: string | undefined;
  }



  export interface IDocument {
    rootNode: boolean; // 是否是根节点
    nodes: IMaterial[] | undefined; // 普通物料节点
    fileName: string | null; // 文件名
    opened: boolean; // 是否打开
    blank: boolean; // 是否空白
    activated: boolean; // 是否激活
    sections: IMaterial[] | undefined; // 容器物料
    prop: IProps | null;
  }


  /**
   * @description 物料树形结构类型
   */
  export interface MaterialTreeType extends RenrenInterface.ITree {
    index: number | string; // 当前节点索引
    icon?: string; // 节点图标
    name: string;
    parentId?: number | string;
    children?: MaterialTreeType[];
    type: string;
  }


  /**
   * @description 项目基类 类型
   */
  export interface IProject {
    projectName: string;
    projectId: string;
    projectPath: string;
    documents: IDocument[] | undefined; // 文档节点列表
    documentsMap: Map<string, IDocument> | undefined; // 文档节点映射表
    simulatorHost: string; // 模拟器地址
    props: IProps[] | undefined;
    currentDocument: IDocument | undefined; // 当前文档节点
  }


  /**
   * @description 创建文档节点参数类型
   */
  export interface createDocumentParamsType {
    isRoot: boolean;
    fileName: string;
    opened: boolean;
    prop: IProps | null;
    projectName: string;
  }


  /**
   * @description 创建项目参数类型
   */
  export interface createProjectParamsType {
    name: string;
    path: string;
    host?: string;
  }
}
