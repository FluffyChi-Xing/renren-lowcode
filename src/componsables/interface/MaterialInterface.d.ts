/**
 * @description 物料 interface 模块
 * @author FluffyChi-Xing
 */
import { RenrenEntity } from "@/componsables/entities/RenrenEntity";


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
    parent?: IMaterial | null; // 物料父项
    zLevel: number; // 物料层级
    props?: IProps | null; // 物料属性
    icon?: string | null; // 物料图标
  }


  /**
   * @description 物料基础属性类型
   */
  export interface IProps {
    id: string;
    items: IProp[] | null;
    owner: IMaterial | null;
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
    owner: IMaterial | null,
    parent: IProp | IProps | undefined;
  }
}
