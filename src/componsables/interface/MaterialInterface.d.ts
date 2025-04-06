/**
 * @description 物料 interface 模块
 * @author FluffyChi-Xing
 */
import { RenrenEntity } from "@/componsables/entities/RenrenEntity";


export namespace MaterialInterface {


  /**
   * @description 基础物料类型
   */
  export interface IMaterial extends RenrenEntity {
    isNode: boolean; // 是否是节点
    title: string;
    isLocked: boolean;
    condition: string; // 物料状态
    conditionGroup: string; // 物料状态组
    hidden: boolean; // 是否隐藏
    id: string; // 物料 ID
    children?: IMaterial[]; // 物料子项
    parent?: IMaterial; // 物料父项
    zLevel: number; // 物料层级
    props?: IProps; // 物料属性
  }


  /**
   * @description 物料基础属性类型
   */
  export interface IProps extends RenrenEntity{
    id: string;
    items: IProp[];
    owner: IMaterial;
    maps: Map<string, IProp>;
    type: string;
    size: number;
  }


  /**
   * @description 子物料项类型
   */
  export interface INodeChildren extends RenrenEntity {
    children: IMaterial[];
    owner: IMaterial;
    size: number;
  }


  export interface IProp extends RenrenEntity {
    items: IProp[];
    maps: Map<string, IProp>;
    code: string;
    key: string;
    value: any;
    type: string;
    owner: IMaterial,
    parent: IProp | IProps;
  }
}
