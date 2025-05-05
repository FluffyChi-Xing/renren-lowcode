/**
 * @description 物料信息接口模块
 * @author FluffyChi-Xing
 */
import type {
  MaterialRespDto
} from "@/componsables/interface/dto/resp/MaterialRespDto";
import {materialApiAggregation} from "@/componsables/apis/material/materialApiAggregation";



/**
 * @description 获取物料信息
 */
export function queryMaterialInfo<T extends MaterialRespDto.QueryMaterialListRespDto>(): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    // 因为物料组件信息可能不怎么改变，所以设置 cache-control
    let headers: Record<string, string> = {};
    let expire: string = new Date(Date.now() + 86400).toUTCString();
    headers['cache-control'] = `max-age=${86400}`;
    headers['expires'] = expire;
    await materialApiAggregation({ url: '/query', headers: headers })
      .then(res => {
        resolve(res.data as T);
      })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * @description 获取所有物料信息列表
 */
export function queryAllMaterial<T extends MaterialRespDto.MaterialInfoRespDto>(): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    await materialApiAggregation({ url: '/queryAll' })
      .then(res => {
        resolve(res.data as T[]);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
}
