/**
 * @description api 聚合模块
 * @author FluffyChi-Xing
 */
import * as login from './apis/user/_apis/UserLoginApis';
import * as material from './apis/material/_apis/MaterialInfoApis';




export const $api = {
  login,
  material
};
