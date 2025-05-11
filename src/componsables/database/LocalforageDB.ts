/**
 * @description 基于 localforage 的 indexedDB 工具模块
 * @author FluffyChi-Xing
 */

import * as localforage from "localforage";


/**
 * @description localforage indexed config params type
 */
export type indexedDBConfigType = {
  // 驱动
  driver: string;
  // 数据库名
  name: string;
  // 数据仓库/表 名
  storeName: string;
  // 数据库版本
  version: number;
  // 数据库描述
  description: string;
};


export type indexedConfigOptions = Partial<indexedDBConfigType>;


export type indexedDBConfigOptions = Partial<indexedDBConfigType>;



interface ILocalforageDB<T> {
  config: indexedDBConfigOptions;
  index: string;
  data: T | string;

  // 查询
  query(key: string, callback?: (err: any, value: T | null) => void): Promise<T | null>;
  // 插入
  insert(key: string, data: T, callback?: (err: any, value: T) => void): Promise<T>;
  // 删除
  delete(key: string, callback?:(err: any) => void): Promise<void>;
  // 清空
  clear(callback?: (err: any) => void): Promise<void>;
  // 获取长度
  count(callback?: (err: any, value: number) => void): Promise<number>;
  // 根据数据的index获取数据名
  key(index: number, callback?: (err: any, value: string) => void): Promise<string>;
  // 获取数据库内的所有表名
  keys(callback?: (err: any, keys: string[]) => void): Promise<string[]>;
  // 设置
  // set(options: LocalForageOptions | string): void;
}

/**
 * @description indexedDB 实体类
 */
export class LocalforageDB<T> implements ILocalforageDB<T>{
  // 数据库配置
  config: indexedDBConfigOptions = {};
  // 存储键
  index: string = 'storage-index';
  // 储存值
  data: T | string = '{}';


  constructor(params?: indexedConfigOptions) {
    if (params) {
      this.config = {
        ...params,
      };
      // setting
      // this.set(this.config);
    }
  }

  clear(callback?: (err: any) => void): Promise<void> {
    return localforage.clear(callback);
  }

  count(callback?: (err: any, value: number) => void): Promise<number> {
    return localforage.length(callback);
  }

  delete(key: string, callback?: (err: any) => void): Promise<void> {
    return localforage.removeItem(key, callback);
  }

  insert(key: string, data: T, callback?: (err: any, value: T) => void): Promise<T> {
    return localforage.setItem(key, data, callback);
  }

  key(index: number, callback?: (err: any, value: string) => void): Promise<string> {
    return localforage.key(index, callback);
  }

  keys(callback?: (err: any, keys: string[]) => void): Promise<string[]> {
    return localforage.keys(callback);
  }

  query(key: string, callback?: (err: any, value: (T | null)) => void): Promise<T | null> {
    return localforage.getItem(key, callback);
  }

  // set(options: LocalForageOptions | string): void {
  //   if (typeof options === 'string') {
  //     localforage.config(options);
  //   } else {
  //     localforage.config({...options});
  //   }
  // }
}
