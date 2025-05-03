/**
 * @description 物料返回数据模块
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";


export namespace MaterialRespDto {


  /**
   * @description 基础物料信息
   */
  export interface defaultMaterialList {
    /**
     * 基础物料
     */
    baseMaterialList: MaterialInterface.IMaterial[];

    /**
     * 图表物料
     */
    chartMaterialList: MaterialInterface.IMaterial[];

    /**
     * 表单物料
     */
    formMaterialList: MaterialInterface.IMaterial[];

    /**
     * 布局物料
     */
    layoutMaterialList: MaterialInterface.IMaterial[];

    /**
     * 导航物料
     */
    navigatorMaterialList: MaterialInterface.IMaterial[];
  }


  /**
   * @description 查询物料列表返回数据
   */
  export interface QueryMaterialListRespDto {

    defaultMaterialList: defaultMaterialList;

    selfMaterialList: MaterialInterface.IMaterial[];
  }


  /**
   * @description 物料回收站返回数据
   */
  export interface MaterialInfoRespDto {
    id: number;

    name: string;

    type: number;

    userId: number;

    data: MaterialInterface.IMaterial;

    status: number;

    isDelete: number;

    isDefault: number;
  }
}
