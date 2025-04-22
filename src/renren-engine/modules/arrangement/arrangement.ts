/**
 * @description 人人低码-编排引擎 编排能力模块
 * @author FluffyChi-Xing
 */
import {MaterialDocumentModel, MaterialProjectModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {
  PAGE_SCHEMA,
  PROJECT_KEY_TO_NAME_MAP_ID,
  SCHEMA_PROJECT_STORAGE_ID,
  SCHEMA_STORAGE_ID
} from "@/componsables/constants/RenrenConstant";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import { v4 as uuidv4 } from 'uuid';
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";


/**
 * @description 保存 schema 到本地
 * @param schema
 * @param fileName
 */
export function saveSchemaToJson(schema: MaterialDocumentModel, fileName?: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (schema) {
        if (fileName) {
          localStorage.setItem(SCHEMA_STORAGE_ID + fileName, JSON.stringify(schema));
        } else {
          localStorage.setItem(SCHEMA_STORAGE_ID, JSON.stringify(schema));
        }
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
export function getSchema(key?: string): Promise<MaterialDocumentModel> {
  return new Promise<MaterialDocumentModel>((resolve, reject) => {
    try {
      if (!key) {
        resolve(JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}') as MaterialDocumentModel);
      } else {
        resolve(JSON.parse(localStorage.getItem(key) || '{}') as MaterialDocumentModel);
      }
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
 * @description 删除文档节点
 * @param key
 */
export function removeSchema(key?: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (key) {
        localStorage.removeItem(key);
      } else {
        localStorage.removeItem(SCHEMA_STORAGE_ID);
      }
    } catch (e) {
      console.error('删除 schema 失败', e);
      reject('删除 schema 失败');
    }
  });
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
function createSchema(): Promise<string> {
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
 * @description 清空物料节点
 */
export function clearMaterialNodes(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const document: MaterialDocumentModel | undefined = await getSchema();
      if (document !== void 0) {
        const isEmpty: boolean = Object.keys(document).length === 0 && document.constructor === Object;
        if (!isEmpty) {
          if (document.nodes) {
            if (document.nodes.length > 0) {
              document.nodes = [];
              // 保存更新后的 schema
              await updateSchema(document).then(() => {
                resolve('清空物料节点成功');
              }).catch(err => {
                console.error('更新 schema 失败', err);
                reject('更新 schema 失败');
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('清空物料节点失败', e);
      reject('清空物料节点失败');
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
      if (schema) {
        if (schema.nodes) {
          // TODO: deleteNode 当前无法正确的删除 node
          schema.nodes = schema.nodes.filter(node => String(node.id) !== String(index));
          await updateSchema(schema);
          resolve('删除节点成功');
        } else {
          reject('删除失败');
        }
      } else {
        reject('删除失败');
      }
    } catch (e) {
      console.log('删除节点失败', e);
      reject('删除节点失败');
    }
  });
}


/**
 * @description 初始化 schema
 */
export function initSchema(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const schema = await getSchema();
      const isEmpty = Object.keys(schema).length === 0 && schema.constructor === Object;
       if (isEmpty) {
         await createSchema().catch(e => {
           console.log('创建 schema 失败', e);
           reject('初始化 schema 失败');
         });
       } else {
         resolve('初始化 schema 成功');
       }
    } catch (e) {
      console.log('初始化 schema 失败', e);
      reject('初始化 schema 失败');
    }
  });
}


/**
 * @description 获取保存的 node 列表
 * 1. 用于在页面不正确刷新后 重新加载页面时，恢复页面的 node 列表
 */
export function getPersistNodeList<T extends RenrenMaterialModel>(): Promise<T[]> {
  return new Promise<T[]>(async (resolve, reject) => {
    try {
    // 获取保存的 schema 信息
      const schema = await getSchema();
      const isEmpty = Object.keys(schema).length === 0 && schema.constructor === Object;
      if (!isEmpty) {
        // 判断是否存在 nodes 属性，否则 schema 损坏
        if (schema.nodes) {
          // 判断 nodes 是否为空， 如果为空，则返回空数组
          if (schema.nodes.length > 0) {
            resolve(schema.nodes as T[]);
          } else {
            resolve([]);
          }
        } else {
          reject('保存节点列表失败');
        }
      } else {
        await createSchema().catch(e => {
          console.log('初始化 schema 失败', e);
          reject('初始化 schema 失败');
        })
      }
    } catch (e) {
      console.log('保存节点列表失败', e);
      reject('保存节点列表失败');
    }
  });
}


/**
 * @description 初始化项目（创建一个新项目）
 * @param params
 */
export function initProject(params: MaterialInterface.createProjectParamsType): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // 检查是否存在同名项目
      const projectName: string = SCHEMA_PROJECT_STORAGE_ID + params?.name;
      const project = JSON.parse(localStorage.getItem(projectName) as string);
      if (project) {
        resolve('项目已存在');
      }
      const id: string = uuidv4(); // 生成项目的唯一 ID
      const newProject = new MaterialProjectModel({
        currentDocument: undefined,
        documents: undefined,
        documentsMap: undefined,
        projectId: id,
        projectName: params.name,
        projectPath: params.path,
        props: undefined,
        simulatorHost: params.host ? params.host : '',
      });
      // 保存项目
      localStorage.setItem(projectName, JSON.stringify(newProject));
      // 更新项目映射表
      // TODO: 目前无法保证数据的一致性(事务)
      await insertProject2Map(id, projectName).catch(err => {
        reject(err as string);
      });
      resolve('创建项目成功');
    } catch (e) {
      console.error('创建项目失败', e);
      reject('创建项目失败');
    }
  });
}


/**
 * @description 将文档节点保存到项目中
 * @param projectName
 * @param node
 */
export function saveDocument2Project(projectName: string, node: MaterialInterface.IDocument): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const project: MaterialProjectModel = JSON.parse(localStorage.getItem(SCHEMA_PROJECT_STORAGE_ID + projectName) as string);
      if (!project || project === void 0) {
        reject('项目不存在');
      }
      project.documents?.push(node);
      // 保存 project
      localStorage.setItem(SCHEMA_PROJECT_STORAGE_ID + projectName, JSON.stringify(project));
      resolve('保存文档成功');
    } catch (e) {
      console.error('保存文档失败', e);
      reject('保存文档失败');
    }
  });
}


/**
 * @description 查询缓存的所有页面键列表
 */
export function queryDocumentStorageIdList(): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    try {
      // 获取当前域名下全部 以 SCHEMA_STORAGE_ID 开头的 key
      const keys: string[] = Object.keys(localStorage).filter(key => key.startsWith(SCHEMA_STORAGE_ID));
      resolve(keys);
    } catch (e) {
      console.error('查询文档列表失败', e);
      reject('查询文档列表失败');
    }
  });
}


/**
 * @description 删除项目中指定的文档节点
 * @param documentName
 * @param projectName
 */
export function removeDocumentFromProject(documentName: string, projectName: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      let project: MaterialProjectModel = JSON.parse(localStorage.getItem(SCHEMA_PROJECT_STORAGE_ID + projectName) as string);
      if (project && project.documents) {
        project.documents = project.documents.filter(doc => doc.fileName !== documentName);
      }
      // 保存 project
      localStorage.setItem(SCHEMA_PROJECT_STORAGE_ID + projectName, JSON.stringify(project));
      resolve('删除文档成功');
    } catch (e) {
      console.error('删除文档失败', e);
      reject('删除文档失败');
    }
  });
}


/**
 * @description 查询缓存的全部项目键列表
 */
export function queryProjectList(): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    try {
      const keys: string[] = Object.keys(localStorage).filter(key => key.startsWith(SCHEMA_PROJECT_STORAGE_ID));
      resolve(keys);
    } catch (e) {
      console.error('查询项目列表失败', e);
      reject('查询项目列表失败');
    }
  });
}


/**
 * @description 创建项目键名映射表
 */
export function createProjectKeyNameMap<T extends RenrenInterface.keyValueType<string>>(): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    try {
      const map: T[] = [];
      localStorage.setItem(PROJECT_KEY_TO_NAME_MAP_ID, JSON.stringify(map));
      resolve(map as unknown as T[]);
    } catch (e) {
      console.error('创建项目键名映射表失败', e);
      reject('创建项目键名映射表失败');
    }
  });
}


/**
 * @description 插入项目键名映射表
 * @param projectId
 * @param projectName
 */
export function insertProject2Map(projectId: string, projectName: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // Initialize map as null
      const m: string | null = localStorage.getItem(PROJECT_KEY_TO_NAME_MAP_ID);
      let map = JSON.parse(m as string);

      // If map is null, create a new one
      if (!m) {
        await createProjectKeyNameMap()
          .catch(err => {
            console.error('创建项目键名映射表失败:', err);
            reject(`创建项目键名映射表失败: ${err}`);
          });
      } else {
        map.push({
          key: projectId,
          value: projectName
        });
        // Save the updated map to localStorage
        localStorage.setItem(PROJECT_KEY_TO_NAME_MAP_ID, JSON.stringify(map));
        resolve('插入项目键名映射表成功');
      }
    } catch (e) {
      console.error('插入项目键名映射表失败:', e);
      reject(`插入项目键名映射表失败: ${e}`);
    }
  });
}


/**
 * @description 清空项目键名映射表
 */
export function clearProjectMap(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      let map: Map<string, string> = JSON.parse(localStorage.getItem(PROJECT_KEY_TO_NAME_MAP_ID) as string) as Map<string, string>;
      if (map) {
        map.clear();
        resolve('清除项目键名映射表成功');
      } else {
        reject('清除项目键名映射表失败');
      }
    } catch (e) {
      console.error('清除项目键名映射表失败', e);
      reject('清除项目键名映射表失败');
    }
  });
}


/**
 * @description 获取项目id对应的项目名称
 * @param id
 */
export function getProjectNameByKey(id: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      // 初始化 map 为 null
      const m: string | null = localStorage.getItem(PROJECT_KEY_TO_NAME_MAP_ID);
      let map = JSON.parse(m as string);
      // 如果 map 存在，尝试获取项目名称
      if (m) {
        const name = map.find((item: RenrenInterface.keyValueType<string>) => item.key === id)?.value;
        if (name) {
          resolve(name);
        } else {
          reject(`未找到 ID 为 ${id} 的项目名称`);
        }
      } else {
        reject('项目键名映射表不存在或无效');
      }
    } catch (e) {
      console.error('获取项目键名映射表失败:', e);
      reject(`获取项目键名映射表失败: ${e}`);
    }
  });
}


/**
 * @description 根据id 更新物料节点
 * @param item
 */
export function updateMaterialNodeById(item: MaterialInterface.IMaterial): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      if (item !== void 0) {
        let schema = await getSchema();
        const isEmpty = Object.keys(schema).length === 0 && schema.constructor === Object;
        if (!isEmpty) {
          // 使用空值合并操作符确保 schema.nodes 不为 undefined
          const nodes = schema.nodes ?? [];
          nodes.forEach((node, index) => {
            if (node.id === item.id) {
              nodes[index] = item;
            }
          });
          // 更新 schema 的 nodes 属性
          schema.nodes = nodes;
          // 将更新后的 schema 保存到 localStorage
          await updateSchema(schema).catch(err => {
            console.error('更新 schema 失败', err);
            reject('更新 schema 失败');
          });
          resolve('更新项目键名映射表成功');
        }
      } else {
        reject(`更新项不存在`);
      }
    } catch (e) {
      console.error('更新项目键名映射表失败', e);
      reject(`更新项目键名映射表失败`);
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
        const isEmpty: boolean = Object.keys(item).length === 0 && item.constructor === Object;
        if (!isEmpty) {
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
        const isEmpty: boolean = Object.keys(schema).length === 0 && schema.constructor === Object;
        if (!isEmpty) {
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


// TODO: 删除某个特定键的项目键名映射表条目

