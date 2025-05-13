import {ofetch} from "ofetch";
import type { FetchOptions } from "ofetch";
import {USER_LOGIN_INFO_FLAG} from "@/componsables/constants/RenrenConstant";
import {HttpRequestMethodEnum} from "@/componsables/enums/HttpRequestMethodEnum";
import {HttpCodeEnum} from "@/componsables/enums/HttpCodeEnum";



/**
 * @description 通用请求模块
 * @param url
 * @param option
 * @param headers
 */
export async function $request(url: string, option?: FetchOptions, headers?: Record<string, string>): Promise<any> {
  return await ofetch(url, {
    async onRequest({ options }) {
      const customHeaders = {
        username: getUsername(),
        token: getToken(),
        userId: getUserId(),
        secretKey: getSecretKey()
      };


      options.headers = {
        ...customHeaders,
        ...(options.headers || {}),
        ...(headers || {})
      };
    },
    async onRequestError() {

    },
    async onResponse({ response }) {
      // 异常请求处理
      if (response.status !== HttpCodeEnum.SUCCESS) {
        return Promise.reject(response);
      }
    },
    async onResponseError({ response }) {

    },
    body: option?.body,
    method: option?.method ? option?.method : HttpRequestMethodEnum.GET,
    baseURL: option?.baseURL,
    query: option?.query,
    params: option?.params,
  })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((err: any) => {
      return Promise.reject(err);
    });
}


/**
 * @description 从 session 中获取用户登录信息对象
 */
function getUserLoginInfoFromSession(): UserInfoRespDto.UserLoginRespDto | null {
  return JSON.parse(sessionStorage.getItem(USER_LOGIN_INFO_FLAG) || '{}');
}


/**
 * @description 保存用户登录信息到 session 中
 * @param userInfo
 */
export function setUserLoginInfoToSession(userInfo: UserInfoRespDto.UserLoginRespDto): Promise<string> {
  return new Promise<string>((resolve) => {
    sessionStorage.setItem(USER_LOGIN_INFO_FLAG, JSON.stringify(userInfo));
    resolve('保存成功');
  });
}


/**
 * @description 从 session 中获取登录 token
 */
export function getToken(): string {
  let userLoginRespDto: UserInfoRespDto.UserLoginRespDto | null = getUserLoginInfoFromSession();
  if (userLoginRespDto) {
    let isEmpty: boolean = Object.keys(userLoginRespDto).length === 0;
    if (!isEmpty) {
      return userLoginRespDto.token || '';
    } else {
      return '';
    }
  } else {
    return '';
  }
}


/**
 * @description 从 session 中获取登录用户名
 */
export function getUsername(): string {
  let userLoginRespDto: UserInfoRespDto.UserLoginRespDto | null = getUserLoginInfoFromSession();
  if (userLoginRespDto) {
    let isEmpty: boolean = Object.keys(userLoginRespDto).length === 0;
    if (!isEmpty) {
      return userLoginRespDto.username || '';
    } else {
      return '';
    }
  } else {
    return '';
  }
}


/**
 * @description 从 session 中获取 secretKey
 */
export function getSecretKey(): string {
  let userLoginRespDto: UserInfoRespDto.UserLoginRespDto | null = getUserLoginInfoFromSession();
  if (userLoginRespDto) {
    let isEmpty: boolean = Object.keys(userLoginRespDto).length === 0;
    if (!isEmpty) {
      return userLoginRespDto.key || '';
    } else {
      return '';
    }
  } else {
    return '';
  }
}


/**
 * @description 获取用户id
 */
export function getUserId(): string {
  let userLoginRespDto: UserInfoRespDto.UserLoginRespDto | null = getUserLoginInfoFromSession();
  if (userLoginRespDto) {
    let isEmpty: boolean = Object.keys(userLoginRespDto).length === 0;
    if (!isEmpty) {
      return userLoginRespDto.userId || '';
    } else {
      return '';
    }
  } else {
    return '';
  }
}
