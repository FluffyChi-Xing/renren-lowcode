/**
 * @description 操作日志响应体类型模块
 * @author FluffyChi-Xing
 */



export namespace OperationLogRespDto {


  /**
   * @description 操作日志响应体类型
   */
  export interface OperationLogInfoRespDto {
    id: number;
    operationName: string;
    operationModule: string;
    operationMethod: number;
    userId: number;
    status: number;
    createTime: string;
    duration: number;
  }


  /**
   * @description 分页查询操作日志响应体类型
   */
  export interface OperationPageRespDto {
    total: number;
    list: OperationLogInfoRespDto[];
  }
}
