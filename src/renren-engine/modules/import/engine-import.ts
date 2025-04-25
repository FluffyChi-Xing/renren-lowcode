/**
 * @description renren-engine 物料导入/注册 API 模块
 * @author FluffyChi-Xing
 */
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import ProxySandbox from "@/renren-engine/sandbox/proxySandbox";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";


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




// 判断一个外来的 json schema 是否符合 本项目的规范
// 1、 按照从 document -> node -> props -> prop 顺序检查整体结构是否满足项目规范
// 2、 提取相应的一个 document , 一个 node 一个props等，检查是否满足全部的字段
/**
 * @description 检查一个 schema 是否符合规范
 * @param item
 */
export function isSchemaValid(item: any): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (typeof item === 'object') {
        // TODO: 待完善
      } else {
        reject('schema格式错误');
      }
    } catch (e) {
      console.error('检查 schema 是否合法失败', e);
      reject('检查 schema 是否合法失败');
    }
  });
}


/**
 * @description 运行第三方函数代码
 * @param code
 */
export function runExternalThirdPartyFunction(code: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    if (code) {
      const externalFunction = new Function(code);
      if (typeof externalFunction === 'function') {
        // 创建沙箱 uuid 座位 name
        const name: string = generateUUID();
        // 创建沙箱环境
        const sandbox = new ProxySandbox(name);
        sandbox.active().catch(err => {
          reject(err as string);
        });
        const { proxy } = sandbox;
        // 在沙箱中运行外来代码
        let result: any;
        try {
          result = externalFunction.call(proxy);
        } catch (e) {
          console.error('运行外来代码失败', e);
          reject('运行外来代码失败');
        }
        // 卸载沙箱环境
        sandbox.inactive().catch(err => {
          reject(err as string);
        });
        resolve(result);
      }
    } else {
      reject('外来代码不存在');
    }
  });
}
