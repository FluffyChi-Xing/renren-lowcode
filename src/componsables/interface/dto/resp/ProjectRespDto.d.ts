/**
 * @description 项目返回响应体接口模块
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";


declare namespace ProjectRespDto {


  /**
   * @description 项目查询返回体结构
   */
  interface ProjectQueryRespDto {

    id: string | number;

    name: string;

    path: string;

    simulatorHost: string;

    isDelete: number;

    data: MaterialInterface.IProject[] | null;

    createTime: string;

    updateTime: string;

    documents: MaterialInterface.IDocument[] | null;
  }
}
