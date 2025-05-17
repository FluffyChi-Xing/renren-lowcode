/**
 * @description 项目信息接口模块
 * @author FluffyChi-Xing
 */
import {projectApiAggregation} from "@/componsables/apis/project/projectApiAggregation";
import type {ProjectRespDto} from "@/componsables/interface/dto/resp/ProjectRespDto";


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


/**
 * @description 分页查询用户项目信息列表
 * @param pageNum
 * @param pageSize
 */
export function queryProjectPage<T extends PageInfoRespDto.PageRespDto<ProjectRespDto.ProjectQueryRespDto>>(
  pageNum: number,
  pageSize: number
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    await projectApiAggregation({
      url: `/page/${pageNum}/${pageSize}`
    })
      .then(res => {
        resolve(res.data as T);
      })
      .catch(err => {
        reject(err);
      });
  });
}
