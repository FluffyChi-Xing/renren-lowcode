/**
 * @description 用户信息相关接口模块
 * @author FluffyChi-Xing
 */
import type {UserInfoRespDto} from "@/componsables/interface/dto/resp/UserInfoRespDto";
import {userApiAggregation} from "@/componsables/apis/user/userApiAggregation";


/**
 * @description 根据id查询用户脱敏信息
 */
export function queryUserById<T extends UserInfoRespDto.UserDesensitizationInfoRespDto>(): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    await userApiAggregation({ url: `/queryById` })
      .then(res => {
        resolve(res.data as T);
      })
      .catch(err => {
        reject(err);
      });
  });
}
