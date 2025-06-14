/**
 * @description 文档接口聚合模块
 * @author FluffyChi-Xing
 */
import type {requestOptions} from "@/componsables/type/RenrenType";
import {$request} from "@/componsables/request";
import {DOC_REQUEST_HOST} from "@/componsables/constants/HttpInfoConstants";


/**
 * @description 文档请求聚合根
 * @param params
 */
export function documentApiAggregation(params: requestOptions): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    const { url, options, headers } = params;
    try {
      await $request(DOC_REQUEST_HOST + url, options, headers)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          console.error('请求失败', err);
          reject('请求失败');
        });
    } catch (e) {
      console.error('请求失败', e);
      reject('请求失败');
    }
  });
}
