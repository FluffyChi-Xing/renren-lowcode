/**
 * @description 用户登录注册相关的 hooks
 * @author FluffyChi-Xing
 */
import {useRoute, useRouter} from "vue-router";
import {$api} from "@/componsables/api";
import {$message} from "@/componsables/element-plus";
import {$const} from "@/componsables/const";


export default function useUser() {
  const route = useRoute();
  const router = useRouter();
  const { userRegister, userLogin, hasLogin, getCaptcha } = $api.login;

  const saveLoginData = (params: UserInfoRespDto.UserLoginRespDto): void => {
    localStorage.setItem($const.ren.USER_LOGIN_INFO_FLAG, JSON.stringify(params));
  };


  const login = (params: UserInfoReqDto.UserLoginReqDto): void => {
    userLogin(params).then(res => {
      $message({
        type: 'success',
        message: '登陆成功'
      });
      saveLoginData(res);
      router.replace('/manage');
    }).catch(_ => {
      $message({
        type: 'warning',
        message: '登录失败'
      });
    });
  };



  const register = (params: UserInfoReqDto.UserRegisterReqDto) => {
    let result: boolean = false;
    userRegister(params).then(_ => {
      $message({
        type: 'success',
        message: '注册成功'
      });
      result = true;
    }).catch(_ => {
      $message({
        type: 'warning',
        message: '注册失败'
      });
      result = false;
    });
    return result;
  };


  return {
    login,
    hasLogin,
    getCaptcha,
    register
  };
}
