/**
 * @description 物料类型枚举类
 */



export enum MaterialTypeEnum {
  BASE = 0, // 基础物料
  CHART = 1, // 图表
  FORM = 2, // 表单
  LAYOUT = 3, // 布局
  NAVIGATOR = 4 // 导航
}


/**
 * @description 物料上下线状态枚举类
 */
export enum MaterialStatusEnum {

  ONLINE = 0, // 上线

  OFFLINE = 1, // 下线
}


/**
 * @description 物料删除状态枚举类
 */
export enum MaterialDeleteEnum {

  UN_DELETED = 0, // 未删除

  DELETED = 1 // 已删除
}


/**
 * @description 物料默认状态枚举类
 */
export enum MaterialDefaultEnum {

  DEFAULT = 0, // 默认

  NOT_DEFAULT = 1 // 非默认
}
