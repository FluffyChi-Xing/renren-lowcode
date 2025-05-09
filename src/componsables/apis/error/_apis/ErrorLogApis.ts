/**
 * @description 异常日志请求接口模块
 * @author FluffyChi-Xing
 */
import type {ErrorLogRespDto} from "@/componsables/interface/dto/resp/ErrorLogRespDto";
import type {PageInfoRespDto} from "@/componsables/interface/dto/resp/PageInfoRespDto";
import {errorLogApiAggregation} from "@/componsables/apis/error/errorLogApiAggregation";


/**
 * @description 分页获取异常日志信息列表
 */
export function pageErrorLogInfoList<K extends ErrorLogRespDto.ErrorLogInfoRespDto,
T extends PageInfoRespDto.PageRespDto<K>>(pageNum: number, pageSize: number): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    await errorLogApiAggregation({
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
