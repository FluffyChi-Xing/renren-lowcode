/**
 * @description 物料返回数据模块
 * @author FluffyChi-Xing
 */


declare namespace MaterialRespDto {


  /**
   * @description 基础物料信息
   */
  interface defaultMaterialList {
    /**
     * 基础物料
     */
    baseMaterialList: MaterialInfoRespDto[];

    /**
     * 图表物料
     */
    chartMaterialList: MaterialInfoRespDto[];

    /**
     * 表单物料
     */
    formMaterialList: MaterialInfoRespDto[];

    /**
     * 布局物料
     */
    layoutMaterialList: MaterialInfoRespDto[];

    /**
     * 导航物料
     */
    navigatorMaterialList: MaterialInfoRespDto[];
  }


  /**
   * @description 查询物料列表返回数据
   */
  interface QueryMaterialListRespDto {

    defaultMaterialList: defaultMaterialList;

    selfMaterialList: MaterialInfoRespDto[];
  }


  /**
   * @description 物料回收站返回数据
   */
  interface MaterialInfoRespDto {
    id: number;

    name: string;

    type: number;

    userId: number;

    data: string;

    status: number;

    isDelete: number;

    isDefault: number;
  }
}
