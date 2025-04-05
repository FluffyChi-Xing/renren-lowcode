/**
 * @description 人人 接口 模块
 * @author FluffyChi-Xing
 */

import { RenrenEntity } from "@/componsables/entities/RenrenEntity";


export namespace RenrenInterface {
  /**
   * @description k-v 类型
   */
  export interface keyValueType<T> {
    key: string;
    value: T;
  }


  /**
   * @description tree interface
   */
  export interface ITree extends RenrenEntity {

    name: string; // 节点名称

    children: this[]; // 子节点

    parentId?: number; // 父节点id
  }
}
