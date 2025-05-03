import type {FetchOptions} from "ofetch";
import {$request} from "@/componsables/request";
import {USER_API_REQUEST_PREFIX} from "@/componsables/constants/HttpInfoConstants";

/**
 * @description 用户类请求聚合函数
 */
export function userApiAggregation(url: string, options?: FetchOptions | RequestInit): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await $request(USER_API_REQUEST_PREFIX + url, options).then(res => {
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
