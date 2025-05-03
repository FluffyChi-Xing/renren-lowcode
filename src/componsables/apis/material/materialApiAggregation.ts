/**
 * @description 物料接口聚合模块
 * @author FluffyChi-Xing
 */
import type {FetchOptions} from "ofetch";
import {$request} from "@/componsables/request";
import {MATERIAL_API_REQUEST_HOST} from "@/componsables/constants/HttpInfoConstants";


/**
 * @description 物料接口聚合模块
 * @param url
 * @param options
 */
export function materialApiAggregation(url: string, options?: FetchOptions | RequestInit): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      await $request(MATERIAL_API_REQUEST_HOST + url, options)
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
