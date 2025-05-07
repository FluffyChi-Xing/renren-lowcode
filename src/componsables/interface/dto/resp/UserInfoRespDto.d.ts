/**
 * @description 用户返回信息 dto 模块
 */
export namespace UserInfoRespDto {


  /**
   * @description 用户登录返回信息
   */
  export interface UserLoginRespDto {
    key: string;
    token: string;
    username: string;
    userId: string;
  }


  /**
   * @description 验证码返回信息
   */
  export interface CaptchaRespDto {
    secretKey: string;
    captcha: string; // base64编码的验证码图片
  }


  /**
   * @description 用户脱敏返回信息
   */
  export interface UserDesensitizationInfoRespDto {
    userId: string;
    username: string;
    password: string;
    email: string;
    avatar?: string;
  }
}
