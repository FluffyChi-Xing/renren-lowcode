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
   * @description x-y 类型
   */
  export interface XAndYType<T, K> {
    x: T;
    y: K;
  }


  /**
   * @description k-v-i 类型
   */
  export interface KeyValueIndexType<T, K> extends keyValueType<T> {
    index: K;
  }


  /**
   * @description tree interface
   */
  export interface ITree {

    name: string; // 节点名称

    children: this[]; // 子节点

    parentId?: number; // 父节点id
  }
}
