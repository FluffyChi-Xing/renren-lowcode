/**
 * @description 项目请求参数模块
 * @author FluffyChi-Xing
 */



export namespace ProjectReqDto {


  /**
   * @description 项目更新请求参数
   */
  export interface UpdateProjectReqDto {

    id: number;

    name: string;

    path: string;

    simulatorHost: string;

    data: string;  // json 风格的项目数据
  }
}
