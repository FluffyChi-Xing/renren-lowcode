/**
 * @description 项目信息接口模块
 * @author FluffyChi-Xing
 */
import {projectApiAggregation} from "@/componsables/apis/project/projectApiAggregation";
import type {ProjectRespDto} from "@/componsables/interface/dto/resp/ProjectRespDto";
import {$enum} from "@/componsables/enum";
import {HttpRequestMethodEnum} from "@/componsables/enums/HttpRequestMethodEnum";


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


/**
 * @description 创建项目 api 接口
 * @param createParams
 */
export function createProject(createParams: ProjectReqDto.CreateProjectReqDto): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const { name, path, data, simulatorHost } = createParams;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('path', path);
    formData.append('data', data);
    formData.append('simulatorHost', simulatorHost);
    await projectApiAggregation({
      url: '/create',
      options: {
        method: HttpRequestMethodEnum.POST,
        body: formData
      }
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
