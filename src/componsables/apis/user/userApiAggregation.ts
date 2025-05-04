import type {FetchOptions} from "ofetch";
import {$request} from "@/componsables/request";
import {USER_API_REQUEST_PREFIX} from "@/componsables/constants/HttpInfoConstants";
import type {requestOptions} from "@/componsables/type/RenrenType";

/**
 * @description 用户类请求聚合函数
 */
export function userApiAggregation(params: requestOptions): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const { url, options, headers } = params;
      await $request(USER_API_REQUEST_PREFIX + url, options, headers).then(res => {
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
