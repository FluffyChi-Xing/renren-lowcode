/**
 * @description renren-engine 物料导入/注册 API 模块
 * @author FluffyChi-Xing
 */
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";


/**
 * @description 人人低码-物料导入/注册能力模块
 * @param path
 */
export function materialRegister(path: RenrenInterface.keyValueType<string>[]): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      // TODO 获取 root/material 下的全部文件夹中的 文件,按照 path 的规则分组,将分组的物料注册到物料库中
    } catch (e) {
      console.log('物料注册失败', e);
      reject('物料注册失败');
    }
  });
}
