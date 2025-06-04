/**
 * @description 人人 接口 模块
 * @author FluffyChi-Xing
 */


declare namespace RenrenInterface {
  /**
   * @description k-v 类型
   */
  interface keyValueType<T> {
    key: string;
    value: T;
  }


  /**
   * @description x-y 类型
   */
  interface XAndYType<T, K> {
    x: T;
    y: K;
  }


  /**
   * @description k-v-i 类型
   */
  interface KeyValueIndexType<T, K> extends keyValueType<T> {
    index: K;
  }


  /**
   * @description tree interface
   */
  interface ITree {

    name: string; // 节点名称

    children: this[]; // 子节点

    parentId?: number; // 父节点id
  }


  /**
   * @description 特性卡片类型
   */
  interface FeatureCardType {
    hover: boolean;
    title: string;
    icon: string;
    description: string;
  }


  /**
   * @description 动画类型
   */
  interface IAnimation {
    label: string;
    children: keyValueType<string>[];
  }


  /**
   * @description 基础事件类型
   */
  interface IEvent {
    name: string; // 事件名称
    type: string; // 事件类型
    description: string; // 事件描述
    id: string; // 事件id
    callback: string | undefined; // 回调函数
  }


  /**
   * @description 基础栈类型
   */
  interface IStack<T> {
    size: number;
    data: T[] | undefined;
  }



  type IRouteMeta = {
    title: string;
    keepAlive?: boolean;
  }


  /**
   * @description 基础路由类型
   */
  interface IRoute {
    path: string;
    name: string;
    component: unknown; // () => import("*.vue");
    meta: IRouteMeta;
  }


  /**
   * @description 物料元素基本位置类型
   */
  interface IItemPosition {
    position: string;
    left: string;
    top: string;
  }
}
