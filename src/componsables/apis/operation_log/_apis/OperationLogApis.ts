/**
 * @description 操作日志接口模块
 * @author FluffyChi-Xing
 */
import {operationApiAggregation} from "@/componsables/apis/operation_log/operationApiAggregation";


/**
 * @description 分页查询用户日志操作日志列表
 * @param pageNum
 * @param pageSize
 */
export function pageQueryOperationLogList<T extends PageInfoRespDto.PageRespDto<OperationLogRespDto.OperationLogInfoRespDto>>(
  pageNum: number,
  pageSize: number
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    await operationApiAggregation({ url: `/page/${pageNum}/${pageSize}` })
      .then(res => {
        resolve(res as T);
      })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * @description 模糊查询用户操作日志记录列表
 * @param query
 * @param page
 * @param size
 */
export function blurQueryOperationLog<T extends OperationLogRespDto.OperationLogSearchRespDto>(
  query: string,
  page: number,
  size: number
): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    await operationApiAggregation({
      url: `/search/${query}/${page}/${size}`
    })
      .then(res => {
        resolve(res as T[]);
      })
      .catch(err => {
        reject(err);
      });
  })
}


/**
 * @description 导出日志的 excel 文件
 */
export function exportExcelLogFile(): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    await operationApiAggregation(
      {
        url: '/export'
      }
    )
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
