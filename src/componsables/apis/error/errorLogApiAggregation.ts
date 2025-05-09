/**
 * @description 异常日志接口聚合模块
 * @author FluffyChi-Xing
 */
import type {requestOptions} from "@/componsables/type/RenrenType";
import {$request} from "@/componsables/request";
import {ERROR_LOG_REQUEST_HOST} from "@/componsables/constants/HttpInfoConstants";


/**
 * @description 异常日志接口请求聚合模块
 * @param params
 */
export function errorLogApiAggregation(params: requestOptions):Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    const { url, options, headers } = params;
    try {
      await $request(ERROR_LOG_REQUEST_HOST + url, options, headers)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          console.error('请求发送错误', err);
          reject(err);
        });
    } catch (e) {
      console.error('请求发送失败', e);
      reject(e);
    }
  });
}
