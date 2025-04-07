/**
 * @description 人人低码-编排引擎 编排能力模块
 * @author FluffyChi-Xing
 */
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {PAGE_SCHEMA, SCHEMA_STORAGE_ID} from "@/componsables/constants/RenrenConstant";


/**
 * @description 保存 schema 到本地
 * @param schema
 */
export function saveSchemaToJson(schema: MaterialDocumentModel): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (schema) {
        localStorage.setItem(SCHEMA_STORAGE_ID, JSON.stringify(schema));
        resolve('保存 schema 成功');
      } else {
        reject('schema 为空');
      }
    } catch (e) {
      console.log('保存 schema 失败', e);
      reject('保存 schema 失败');
    }
  });
}


/**
 * @description 获取本地的 schema
 */
export function getSchema(): Promise<MaterialDocumentModel> {
  return new Promise<MaterialDocumentModel>((resolve, reject) => {
    try {
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
 */
export function updateSchema(schema: MaterialDocumentModel): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      localStorage.setItem(SCHEMA_STORAGE_ID, JSON.stringify(schema));
      resolve('更新 schema 成功');
    } catch (e) {
      console.log('更新 schema 失败', e);
      reject('更新 schema 失败');
    }
  });
}

/**
 * @description 获取当前文档树的全部 node 节点
 */
export function queryNodeList<T extends RenrenMaterialModel>(): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    try {
      const schema = await getSchema();
      if (schema && schema.nodes) {
        const nodes = schema.nodes.filter(node => node.isNode) as T[];
        resolve(nodes);
      } else {
        resolve([]);
      }
    } catch (e) {
      console.log('获取节点失败', e);
      reject('获取节点失败');
    }
  })
}


/**
 * @description 插入节点到 nodes 中
 * @param node
 */
export function insertNode2Document(node: RenrenMaterialModel): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const schema = await getSchema();
      if (schema) {
        schema.nodes?.push(node);
        await updateSchema(schema);
        resolve('插入节点成功');
      } else {
        reject('插入失败');
      }
    } catch (e) {
      console.log('插入节点失败', e);
      reject('插入节点失败');
    }
  });
}


/**
 * @description 检查节点是否存在
 * @param index
 */
export function hasNode(index: string): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const schema: MaterialDocumentModel = await getSchema();
      if (schema !== undefined && schema.nodes) {
        const nodes = schema.nodes.filter(node => node.isNode);
        if (nodes.some(node => node.id === index)) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        reject('查询节点失败');
      }
    } catch (e) {
      console.log('查询节点失败', e);
      reject('查询节点失败');
    }
  });
}


/**
 * @description 创建 schema
 */
export function createSchema(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const schema = new MaterialDocumentModel(PAGE_SCHEMA);
      await updateSchema(schema);
      resolve('创建 schema 成功');
    } catch (e) {
      console.log('创建 schema 失败', e);
      reject('创建 schema 失败');
    }
  });
}


/**
 * @description 删除节点
 * @param index
 */
export function deleteNode(index: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const schema = await getSchema();
      if (schema && schema.nodes) {
        schema.nodes = schema.nodes.filter(node => node.id !== index);
        await updateSchema(schema);
        resolve('删除节点成功');
      } else {
        reject('删除失败');
      }
    } catch (e) {
      console.log('删除节点失败', e);
      reject('删除节点失败');
    }
  });
}
