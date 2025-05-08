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
   * @description 操作日志搜索响应体类型
   */
  export interface OperationLogSearchRespDto {
    duration: number;
    createTime: string;
    operationName: string;
    operationModule: string;
    id: number;
    operationMethod: number;
    userId: number;
    status: number;
    _formatted: OperationLogSearchFormattedRespDto;
  }


  export interface OperationLogSearchFormattedRespDto {
    id: string;
    userId: string;
    operationName: string;
    operationMethod: string;
    status: string;
    duration: string;
    createTime: string;
    operationModule: string;
  }
}
