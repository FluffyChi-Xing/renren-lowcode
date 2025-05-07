/**
 * @description 操作日志方法枚举
 */
export enum OperationMethodEnum {
  GET = 0,
  POST = 1,
  PUT = 2,
  DELETE = 3,
  PATCH = 4,
}


/**
 * @description 操作日志方法对应的 element-type 枚举
 */
export enum OperationMethodTypeEnum {
  success = 0,
  warning = 1,
  danger = 2,
  info = 3,
  default = 4
}


/**
 * @description 操作日志状态对应的 element-type 枚举
 */
export enum OperationStatusTypeEnum {
  success = 200,
  warning = 300,
  danger = 500,
}
