/**
 * @description 项目基本type
 * @author FluffyChi-Xing
 */


import type {FetchOptions} from "ofetch";

/**
 * @description classConstructor type
 */
export type ClassConstructor<T = any> = {
  new(...args: any[]): T;
}



export type RequestOptions = {
  url: string,
  options: FetchOptions,
  headers: Record<string, string>
}


export type requestOptions = Partial<RequestOptions>;
