/**
 * @description 异常日志响应体类型模块
 * @author FluffyChi-Xing
 */




export namespace ErrorLogRespDto {


  /**
   * @description 异常日志响应体类型
   */
  export interface ErrorLogInfoRespDto {
    id: number;
    message: string;
    source: string;
    lineno: number;
    colno: number;
    error: string;
    frame: number;
    ip: number;
    network: number;
    os: number;
    browser: number;
    createTime: string;
    userId: number;
    projectId: number;
    documentId: number;
  }
}
