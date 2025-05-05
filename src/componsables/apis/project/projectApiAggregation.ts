/**
 * @description 项目接口聚合模块
 * @author FluffyChi-Xing
 */
import type {requestOptions} from "@/componsables/type/RenrenType";
import {$request} from "@/componsables/request";
import {PROJECT_API_REQUEST_HOST} from "@/componsables/constants/HttpInfoConstants";


/**
 * @description 项目接口聚合模块
 * @param params
 */
export function projectApiAggregation(params: requestOptions): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const { url, options, headers } = params;
      await $request(PROJECT_API_REQUEST_HOST + url, options, headers)
        .then(res => {
          resolve(res);
        }).catch(err => {
          console.error('请求发送错误', err);
          reject(err);
        });
    } catch (e) {
      console.error('请求发送失败', e);
      reject(e);
    }
  });
}
