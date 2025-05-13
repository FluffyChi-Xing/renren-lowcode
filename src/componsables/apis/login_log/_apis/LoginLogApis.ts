/**
 * @description 登录日志信息接口模块
 * @author FluffyChi-Xing
 */
import {loginLogApiAggregation} from "@/componsables/apis/login_log/loginLogApiAggregation";


/**
 * @description 分页获取用户登录日志信息
 * @param pageNum
 * @param pageSize
 */
export function pageLoginLogInfoList<K extends LoginLogRespDto.LoginLogInfoRespDto,
  T extends PageInfoRespDto.PageRespDto<K>>(pageNum: number, pageSize: number): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    await loginLogApiAggregation({
      url: `/page/${pageNum}/${pageSize}`
    })
      .then(res => {
        resolve(res as T);
      })
      .catch(err => {
        reject(err);
      });
  });
}
