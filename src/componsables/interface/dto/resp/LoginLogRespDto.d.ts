/**
 * @description 登录日志响应体类型聚合模块
 * @author FluffyChi-Xing
 */



declare namespace LoginLogRespDto {


  /**
   * @description 登录日志信息响应体类型
   */
  interface LoginLogInfoRespDto {
    id: number;
    userId: number;
    ip: string;
    browser: string;
    createTime: string;
    status: number;
  }
}
