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
}
