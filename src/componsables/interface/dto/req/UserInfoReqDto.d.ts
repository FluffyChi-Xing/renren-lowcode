/**
 * @description 用户信息请求参数接口模块
 */
export namespace UserInfoReqDto {


  /**
   * @description 用户登录请求参数
   */
  export interface UserLoginReqDto {
    username: string;
    secretKey: string;
    code: string;
    password: string;
  }


  /**
   * @description 用户注册请求参数
   */
  export interface UserRegisterReqDto extends UserLoginReqDto {
    email: string;
  }


  /**
   * @description 用户登录表单请求参数
   */
  export interface UserLoginFormReqDto {
    username: string;
    code: string;
    password: string;
  }


  /**
   * @description 用户注册表单请求参数
   */
  export interface UserRegisterFormReqDto extends UserLoginFormReqDto{
    email: string;
  }
}
