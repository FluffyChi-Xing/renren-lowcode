/**
 * @description mybatis plus 分页插件对应的响应体模块
 * @author FluffyChi-Xing
 */



declare namespace PageInfoRespDto {


  /**
   * @description 自定义分页响应体类型
   */
  interface PageRespDto<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
  }
}
