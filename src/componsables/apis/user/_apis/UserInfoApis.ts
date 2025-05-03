/**
 * @description 用户信息相关接口模块
 * @author FluffyChi-Xing
 */
import type {UserInfoRespDto} from "@/componsables/interface/dto/resp/UserInfoRespDto";
import {userApiAggregation} from "@/componsables/apis/user/userApiAggregation";
import {HttpCodeEnum} from "@/componsables/enums/HttpCodeEnum";


/**
 * @description 根据id查询用户脱敏信息
 * @param id
 */
export function queryUserById<T extends UserInfoRespDto.UserDesensitizationInfoRespDto>(id: string): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    await userApiAggregation(`/queryBiId/${id}`)
      .then(res => {
        if (res.code === HttpCodeEnum.SUCCESS) {
          resolve(res.data as T);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
