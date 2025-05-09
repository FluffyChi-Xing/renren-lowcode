/**
 * @description 登录日志接口聚合模块
 * @author FluffyChi-Xing
 */
import type {requestOptions} from "@/componsables/type/RenrenType";
import {$request} from "@/componsables/request";
import {LOGIN_LOG_REQUEST_HOST} from "@/componsables/constants/HttpInfoConstants";


/**
 * @description 登录日志接口聚合请求模块
 * @param params
 */
export function loginLogApiAggregation(params: requestOptions): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const { url, options, headers } = params;
    try {
      $request(LOGIN_LOG_REQUEST_HOST + url, options, headers)
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
