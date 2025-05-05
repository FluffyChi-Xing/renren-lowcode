/**
 * @description 物料接口聚合模块
 * @author FluffyChi-Xing
 */
import {$request} from "@/componsables/request";
import {MATERIAL_API_REQUEST_HOST} from "@/componsables/constants/HttpInfoConstants";
import type {requestOptions} from "@/componsables/type/RenrenType";


/**
 * @description 物料接口聚合模块
 * @param params
 */



export function materialApiAggregation(params: requestOptions): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    // 创建日志分组
    console.group('material');
    try {
      const { url, options, headers } = params;
      await $request(MATERIAL_API_REQUEST_HOST + url, options, headers)
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
    console.groupEnd();
  });
}
