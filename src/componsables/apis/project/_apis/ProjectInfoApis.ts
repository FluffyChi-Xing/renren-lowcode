/**
 * @description 项目信息接口模块
 * @author FluffyChi-Xing
 */
import type {ProjectRespDto} from "@/componsables/interface/dto/resp/ProjectRespDto";
import {projectApiAggregation} from "@/componsables/apis/project/projectApiAggregation";
import {HttpCodeEnum} from "@/componsables/enums/HttpCodeEnum";


/**
 * @description 查询用户项目信息
 */
export function queryProjectInfo<T extends ProjectRespDto.ProjectQueryRespDto>(): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    await projectApiAggregation({ url: '/query' })
      .then(res => {
        resolve(res.data as T[]);
      }).catch(err => {
        reject(err);
      });
  });
}
