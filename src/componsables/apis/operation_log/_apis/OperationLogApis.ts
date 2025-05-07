/**
 * @description 操作日志接口模块
 * @author FluffyChi-Xing
 */
import type {OperationLogRespDto} from "@/componsables/interface/dto/resp/OperationLogRespDto";
import {operationApiAggregation} from "@/componsables/apis/operation_log/operationApiAggregation";


/**
 * @description 分页查询用户日志操作日志列表
 * @param pageNum
 * @param pageSize
 */
export function pageQueryOperationLogList<T extends OperationLogRespDto.OperationPageRespDto>(
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
