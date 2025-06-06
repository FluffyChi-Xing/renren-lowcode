/**
 * @description 物料信息接口模块
 * @author FluffyChi-Xing
 */
import {materialApiAggregation} from "@/componsables/apis/material/materialApiAggregation";
import {HttpRequestMethodEnum} from "@/componsables/enums/HttpRequestMethodEnum";



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


/**
 * @description 创建物料请求参数
 */
export type createMaterialReqDto = {
  name: string;
  type: string;
  // material toJSONString
  data: string;
};


/**
 * @description 新建自定义物料
 * @param params
 */
export function createSelfMaterial(params: createMaterialReqDto): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    const { name, type, data } = params;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('data', data);
    await materialApiAggregation({
      url: '/create',
      options: {
        method: HttpRequestMethodEnum.POST,
        body: formData
      }
    })
      .then(res => {
        resolve(res.data as string);
      })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * @description 更新物料状态请求参数
 */
export type updateMaterialStatusReqDto = {
  id: number;
  status: number;
};


/**
 * @description 变更物料状态
 * @param params
 */
export function updateMaterialStatus(params: updateMaterialStatusReqDto): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    const { id, status } = params;
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('status', status.toString());
    await materialApiAggregation({
      url: '/editStatus',
      options: {
        method: HttpRequestMethodEnum.POST,
        body: formData
      }
    })
      .then(res => {
        resolve(res); // TODO: 检查是否需要改为 res.data
      })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * @description 获取回收站物料列表
 */
export function queryMaterialRecycleBin<T extends MaterialRespDto.MaterialInfoRespDto>(): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    await materialApiAggregation({
      url: '/recycleBin'
    })
      .then(res => {
        resolve(res as T[]);
      })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * @description 删除指定的物料信息
 * @param id
 */
export function deleteMaterialInfo(id: number): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    await materialApiAggregation({
      url: `/delete/${id}`
    })
      .then(res => {
        resolve(res.data as string);
      })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * @description 分页获取物料回收站列表
 * @param pageNum
 * @param pageSize
 */
export function queryRecycleBinPage<T extends PageInfoRespDto.PageRespDto<MaterialRespDto.MaterialInfoRespDto>>(pageNum: number, pageSize: number): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    await materialApiAggregation(
      {
        url: `/recycleBin/page/${pageNum}/${pageSize}`
      }
    )
      .then(res => {
        resolve(res.data as T);
      })
      .catch(err => {
        reject(err);
      });
  });
}
