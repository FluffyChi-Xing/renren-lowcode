/**
 * @description 人人低码-编排引擎 编排能力模块
 * @author FluffyChi-Xing
 */
import {MaterialDocumentModel} from "@/componsables/models/MaterialModel";
import {
  SCHEMA_STORAGE_ID
} from "@/componsables/constants/RenrenConstant";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {LocalforageDB} from "@/componsables/database/LocalforageDB";
import {$util} from "@/componsables/utils";


/**
 * @description 获取本地的 schema
 */
export function getSchema(key?: string): Promise<MaterialDocumentModel> {
  return new Promise<MaterialDocumentModel>((resolve, reject) => {
    try {
      key ?
      resolve(JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + key) || '{}') as MaterialDocumentModel)
        :
      resolve(JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}') as MaterialDocumentModel);
    } catch (e) {
      console.log('获取 schema 失败', e);
      reject('获取 schema 失败');
    }
  })
}


/**
 * @description 更新 schema
 * @param schema
 * @param key // 文档节点 key optional
 */
export function updateSchema(schema: MaterialDocumentModel, key?: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const indexedDB = new LocalforageDB();
      if (key) {
        await indexedDB.insert(SCHEMA_STORAGE_ID + key, schema).catch(err => {
          console.log(err);
        });
        localStorage.setItem(SCHEMA_STORAGE_ID + key, JSON.stringify(schema));
      } else {
        await indexedDB.insert(SCHEMA_STORAGE_ID, schema).catch(err => {
          console.log(err);
        });
        localStorage.setItem(SCHEMA_STORAGE_ID, JSON.stringify(schema));
      }
      resolve('更新 schema 成功');
    } catch (e) {
      console.log('更新 schema 失败', e);
      reject('更新 schema 失败');
    }
  });
}


/**
 * @description 更新文档的属性节点
 * @param props
 */
export function updateDocumentPropNode(props: MaterialInterface.IProp[]): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      let item: MaterialDocumentModel | undefined = await getSchema();
      if (item !== void 0 && props.length > 0) {
        if (!$util.renren.isEmpty(item)) {
          if (item?.prop && item?.prop.items) {
            if (item.prop.items.length > 0) {
              const nodes = item.prop.items ?? [];
              nodes.forEach((node, index) => {
                if (node.key === props[index].key) {
                  node.value = props[index].value;
                }
              });
              item.prop.items = nodes;
              // 保存更新后的 schema
              await updateSchema(item).then(() => {
                resolve('更新 schema 成功');
              }).catch(err => {
                reject(err as string);
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('更新文档属性失败', e);
      reject('更新文档属性失败');
    }
  });
}


/**
 * @description 向物料节点插入动画效果
 * @param key 物料id
 * @param animation 动画效果(RenrenInterface.keyValueType<string>)
 */
export function insertAnimation2Material(key: string, animation: RenrenInterface.keyValueType<string>): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const schema: MaterialDocumentModel | undefined = await getSchema();
      if (schema !== void 0) {
        if (!$util.renren.isEmpty(schema)) {
          const nodes: MaterialInterface.IMaterial[] | undefined = schema?.nodes;
          if (nodes !== void 0 && nodes?.length > 0) {
            let material: MaterialInterface.IMaterial | undefined = nodes?.find(node => node.id === key);
            if (material !== void 0 && material?.animation) {
              if (material?.animation.length > 0) {
                reject('每个节点只能插入一个动画');
              } else {
                material?.animation.push(animation);
                // 保存更新后的 schema
                await updateSchema(schema).catch(err => {
                  reject(`更新 schema 失败: ${err}`);
                });
                resolve('插入动画成功');
              }
            } else {
              reject('没有找到匹配的节点');
            }
          }
        }
      }
    } catch (e) {
      console.error('插入动画失败', e);
      reject('插入动画失败');
    }
  });
}


/**
 * @description 更新文档节点标题
 * @warn 由于当前测试环境中只存在一个无特殊命名的 document node，为了页面能正常开发，将 originalTitle 设定为可选属性
 * @param newTitle
 * @param originalTitle
 */
export function editDocumentTitle(newTitle: string, originalTitle?: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // 获取schema
      let schema: MaterialDocumentModel | undefined;
      if (originalTitle) {
        schema = await getSchema(originalTitle);
      } else {
        schema = await getSchema();
      }
      if (schema !== void 0) {
        if (schema.fileName) {
          // 更新文档节点名称
          schema.fileName = newTitle;
        }
        // 保存文档节点
        if (originalTitle) {
          updateSchema(schema, originalTitle).catch(err => {
            console.error('更新 schema 失败', err);
            reject(err as string);
          });
        } else {
          updateSchema(schema).catch(err => {
            console.error('更新 schema 失败', err);
            reject(err as string);
          });
        }
        // 如果存在 originalTitle
        resolve('更新文档标题成功');
      }
    } catch (e) {
      console.error('编辑文档标题失败', e);
      reject('编辑文档标题失败');
    }
  });
}


/**
 * @description 获取本地持久化的全部页面节点
 */
export function queryAllDocuments<T extends MaterialDocumentModel>(): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    try {
      let result: T[] = [];
      Object.keys(localStorage).forEach(item => {
        if (item.startsWith(SCHEMA_STORAGE_ID)) {
          result.push(JSON.parse(localStorage.getItem(item) as string) as T);
        }
      });
      resolve(result);
    } catch (e) {
      console.error('查询所有文档失败', e);
      reject('查询所有文档失败');
    }
  });
}

