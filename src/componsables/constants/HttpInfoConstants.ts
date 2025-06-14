/**
 * @description http 相关信息常量模块
 * @author FluffyChi-Xing
 */


/**
 * @description http 基础请求地址
 */
export const HTTP_BASE_REQUEST_HOST: string = 'http://lc.fluffycx.cn:10086/api/renren';




/**
 * @description 用户 api 请求前缀
 */
export const USER_API_REQUEST_PREFIX: string = `${HTTP_BASE_REQUEST_HOST}/user`;


/**
 * @description 物料 api 请求前缀
 */
export const MATERIAL_API_REQUEST_HOST: string = `${HTTP_BASE_REQUEST_HOST}/material`;



export const PROJECT_API_REQUEST_HOST: string = `${HTTP_BASE_REQUEST_HOST}/project`;



export const OPERATION_LOG_REQUEST_HOST:string = `${HTTP_BASE_REQUEST_HOST}/operation`;


export const LOGIN_LOG_REQUEST_HOST: string = `${HTTP_BASE_REQUEST_HOST}/loginLog`;


export const ERROR_LOG_REQUEST_HOST: string = `${HTTP_BASE_REQUEST_HOST}/error`;

export const DOC_REQUEST_HOST: string = `${HTTP_BASE_REQUEST_HOST}/document`;
