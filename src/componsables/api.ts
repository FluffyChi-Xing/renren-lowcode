/**
 * @description api 聚合模块
 * @author FluffyChi-Xing
 */
import * as login from './apis/user/_apis/UserLoginApis';
import * as info from './apis/user/_apis/UserInfoApis';
import * as material from './apis/material/_apis/MaterialInfoApis';
import * as operation from './apis/operation_log/_apis/OperationLogApis';
import * as loginLog from './apis/login_log/_apis/LoginLogApis';
import * as error from './apis/error/_apis/ErrorLogApis';
import * as project from './apis/project/_apis/ProjectInfoApis';




export const $api = {
  login,
  material,
  info,
  operation,
  loginLog,
  error,
  project,
};
