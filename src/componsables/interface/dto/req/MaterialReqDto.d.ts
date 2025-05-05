/**
 * @description 物料请求参数模块
 * @author FluffyChi-Xing
 */




export namespace MaterialReqDto {


  /**
   * @description 创建物料参数
   */
  export interface CreateMaterialReqDto {

    name: string;

    type: number;

    data: string; // MaterialInterface.IMaterial -> JSON.stringify()
  }


  /**
   * @description 更新物料请求参数
   */
  export interface UpdateMaterialReqDto {

    id: number;

    name: string;

    type: number;

    data: string; // json string

    status: number;
  }
}
