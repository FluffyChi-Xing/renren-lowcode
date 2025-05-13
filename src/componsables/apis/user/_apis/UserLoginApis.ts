import {userApiAggregation} from "@/componsables/apis/user/userApiAggregation";
import type {FetchOptions} from "ofetch";
import {HttpRequestMethodEnum} from "@/componsables/enums/HttpRequestMethodEnum";
import {HttpCodeEnum} from "@/componsables/enums/HttpCodeEnum";


/**
 * @description 用户登录接口
 * @param params
 */
export function userLogin<T extends UserInfoRespDto.UserLoginRespDto>(params: UserInfoReqDto.UserLoginReqDto): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    let data = new FormData();
    data.append('username', params.username);
    data.append('password', params.password);
    data.append('secretKey', params.secretKey);
    data.append('code', params.code);
    let options: FetchOptions = {
      method: HttpRequestMethodEnum.POST,
      body: data,
    };
    let headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    await userApiAggregation({ url: '/login', options: options, headers: headers })
      .then(res => {
        if (res.code === HttpCodeEnum.SUCCESS) {
          resolve(res.data as T);
        } else {
          reject(res.msg);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * @description 获取验证码接口
 */
export function getCaptcha<T extends UserInfoRespDto.CaptchaRespDto>(): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    await userApiAggregation({ url: '/captcha' })
      .then(res => {
        if (res.code === HttpCodeEnum.SUCCESS) {
          resolve(res.data as T);
        } else {
          reject(res.msg);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * @description 查询用户登录状态接口
 */
export function hasLogin(): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    await userApiAggregation({ url: '/hasLogin' })
      .then(res => {
        if (res.code === HttpCodeEnum.SUCCESS) {
          resolve(res.data as boolean);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}


/**
 * @description 用户注册接口
 * @param params
 */
export function userRegister(params: UserInfoReqDto.UserRegisterReqDto): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let data = new FormData();
    data.append('username', params.username);
    data.append('password', params.password);
    data.append('email', params.email);
    data.append('secretKey', params.secretKey);
    data.append('code', params.code);
    let options: FetchOptions = {
      body: data,
      method: HttpRequestMethodEnum.POST,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    await userApiAggregation({ url: '/register', options: options })
      .then(res => {
        if (res.code === HttpCodeEnum.SUCCESS) {
          resolve(res.data as string);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
