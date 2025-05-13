/**
 * @description 操作日志响应体类型模块
 * @author FluffyChi-Xing
 */


declare namespace OperationLogRespDto {


  /**
   * @description 操作日志响应体类型
   */
  interface OperationLogInfoRespDto {
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
  interface OperationLogSearchRespDto {
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


  interface OperationLogSearchFormattedRespDto {
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
