import type {UserInfoRespDto} from "@/componsables/interface/dto/resp/UserInfoRespDto";
import type {UserInfoReqDto} from "@/componsables/interface/dto/req/UserInfoReqDto";
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
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    await userApiAggregation('/login', options)
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
    await userApiAggregation('/captcha')
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
