/**
 * @description 文档节点请求聚合模块
 * @author FluffyChi-Xing
 */
import {documentApiAggregation} from "@/componsables/apis/document/documentApiAggregation";

// TODO 待完善接口返回类型
/**
 * @description 通过id查询文档节点
 * @param index
 */
export function queryDocumentById(index: string): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const url: string = `/queryById/${index}`;
      await documentApiAggregation({
        url: url
      })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    } catch (e) {
      console.error('查询文档失败', e);
      reject('查询文档失败');
    }
  });
}
