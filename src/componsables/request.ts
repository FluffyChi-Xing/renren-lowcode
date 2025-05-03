import {ofetch} from "ofetch";
import type { FetchOptions } from "ofetch";
import {$enum} from "@/componsables/enum";
import type {UserInfoRespDto} from "@/componsables/interface/dto/resp/UserInfoRespDto";
import {USER_LOGIN_INFO_FLAG} from "@/componsables/constants/RenrenConstant";
import {HttpCodeEnum} from "@/componsables/enums/HttpCodeEnum";


/**
 * @description 通用请求模块
 * @param url
 * @param options
 * @param headers
 */
export async function $request(url: string, options?: FetchOptions | RequestInit, headers?: HeadersInit): Promise<any> {
  return await ofetch(url, {
    async onRequest() {
      if (url === null || url === void 0) {
        return Promise.reject('url不能为空');
      }
      // 默认请求参数
      if (options === void 0) {
        options = {
          method: $enum.HttpRequestMethodEnum.GET,
          headers: {
            'username': getUsername(),
            'token': getToken(),
            'userId': '',
            'secretKey': getSecretKey(),
            ...headers
          }
        };
      } else {
        options.headers = {
          'username': getUsername(),
          'token': getToken(),
          'userId': '',
          'secretKey': getSecretKey(),
          ...headers
        };
      }
    },
    async onRequestError() {

    },
    async onResponse() {

    },
    async onResponseError() {

    },
    ...options,
  })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((err: any) => {
      console.error('请求失败', err);
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
 * @description 从 session 中获取登录 token
 */
export function getToken(): string {
  let userLoginRespDto: UserInfoRespDto.UserLoginRespDto | null = getUserLoginInfoFromSession();
  if (userLoginRespDto) {
    let isEmpty: boolean = Object.keys(userLoginRespDto).length === 0;
    if (!isEmpty) {
      return userLoginRespDto.token;
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
      return userLoginRespDto.username;
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
      return userLoginRespDto.key;
    } else {
      return '';
    }
  } else {
    return '';
  }
}
