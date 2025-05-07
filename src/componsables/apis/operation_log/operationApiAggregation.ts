/**
 * @description 操作日志接口聚合模块
 * @author FluffyChi-Xing
 */
import type {requestOptions} from "@/componsables/type/RenrenType";
import {$request} from "@/componsables/request";
import {HttpCodeEnum} from "@/componsables/enums/HttpCodeEnum";
import {OPERATION_LOG_REQUEST_HOST} from "@/componsables/constants/HttpInfoConstants";


export function operationApiAggregation(params: requestOptions): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const { url, options, headers } = params;
      await $request(OPERATION_LOG_REQUEST_HOST + url, options, headers)
        .then(res => {
          if (res.code === HttpCodeEnum.SUCCESS) {
            resolve(res.data);
          }
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
