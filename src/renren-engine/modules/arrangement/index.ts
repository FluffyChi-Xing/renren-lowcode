/**
 * @description 重构物料编排引擎
 * @author FluffyChi-Xing -> feature/refactor-engine
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {LocalforageDB} from "@/componsables/database/LocalforageDB";
import {SCHEMA_PROJECT_STORAGE_ID, SCHEMA_STORAGE_ID} from "@/componsables/constants/RenrenConstant";
import documentSchema from './page-schema.json';


/**
 * @description 基本状态类型
 */
interface IState<T extends MaterialInterface.IMaterial> {
  components: Map<string, T>;
  selectedId?: string;
  /** other attributes wait for update **/
}

type EventListener = (event: unknown) => void;


type createProject = {
  name: string;
  path: string;
  host?: string;
}



type createDocument = {
  name: string;
  path: string;
  schema: MaterialInterface.IDocument;
}

export interface IArrangement<T extends MaterialInterface.IMaterial> {


  // 引擎初始化
  init(): void;

  // 添加物料
  addComponent(item: T, key?: string): Promise<string>;

  // 移动物料
  moveComponent(item: T, position: RenrenInterface.KeyValueIndexType<string, string>[], key?: string): Promise<T>;

  // 移除物料
  removeComponent(itemId: string, documentId?: string): Promise<string>;

  // 事件监听
  on(event: string, callback: EventListener): Promise<string>;

  // 事件发布
  emit(event: string, data: any): void;

  // 状态获取
  getState(): IState<MaterialInterface.IMaterial> | undefined;

  // 实例销毁
  destroy(): void;

  // 结构验证
  verify(item: any): boolean;

  // 获取指定的物料
  getComponent(itemId: string, key?: string): T | undefined;

  // 获取物料列表
  getComponents(documentId?: string): T[];

  // 更新物料节点
  updateComponent(item: T, key?: string): Promise<string>;

  // 获取项目结构树
  getSchemaTree(projectId?: string): MaterialInterface.IProject | undefined;

  // 清空
  clear(key?: string): Promise<string>;

  // 创建项目
  createProject(params: createProject): Promise<string>;

  // 创建页面
  createDocument(params: createDocument): void;

  // 获取页面
  getDocument(documentId?: string): MaterialInterface.IDocument | undefined;

  // 编辑页面
  editDocument(documentId: string): MaterialInterface.IDocument | undefined;

  // 编辑页面标题
  editDocumentName(newName: string, oldName?: string): Promise<string>;

  // 初始化页面
  initDocument(key?: string, name?: string): Promise<string>;

  // 删除页面
  removeDocument(documentId: string): Promise<string>;

  // 更新页面
  updateDocument(item: MaterialInterface.IDocument, name?: string): void;

  // 获取所有页面节点
  getAllDocuments<K extends MaterialInterface.IDocument>(): Promise<K[]>;

  // 删除项目
  removeProject(projectId: string): Promise<string>;

  // 获取某个 document  下的所有物料节点
  getAllElementNodes(key?: string): MaterialInterface.IMaterial[];

  // 更新页面属性
  updateDocumentProp(props: MaterialInterface.IProp[], key?: string): Promise<string>;

  get getComponentCount(): number;

  get getInstance(): IArrangement<T>;
}


/**
 * @description 编排引擎
 */
class Arrangement <T extends MaterialInterface.IMaterial> implements IArrangement<T>{

  state: IState<T> = {
    components: new Map(),
    selectedId: void 0,
  };

  private eventListeners: Map<string, EventListener[]> = new Map<string, EventListener[]>();

  constructor() {
  }


  /**
   * @description 初始化编排引擎
   */
  init(): void {
    this.state = { components: new Map() };
    this.eventListeners.clear();
  }

  /**
   * @description 销毁引擎实例
   */
  destroy(): void {
    this.state.components = new Map<string, T>();
    this.eventListeners.clear();
  }

  /**
   * @description 监听事件
   * @param event
   * @param callback
   */
  on(event: string, callback: EventListener): Promise<string> {
    return new Promise<string>((resolve) => {
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, []);
      } else {
        this.eventListeners.get(event)!.push(callback);
      }
    });
  }

  /**
   * @description 发布事件
   * @param event
   * @param data
   */
  emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  /**
   * @description 获取状态
   */
  getState(): IState<T> | undefined {
    return this.state;
  }

  /**
   * @description 添加物料 对应重构前的 insertNode2Document api
   * @param item
   * @param key
   */
  addComponent(item: MaterialInterface.IMaterial, key?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        let targetDocument: MaterialInterface.IDocument | undefined;
        if (key !== void 0) {
          targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + key) || '{}');
        } else {
          targetDocument  = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}');
        }
        if (targetDocument !== void 0) {
          targetDocument?.nodes?.push(item);
          // 将组件信息存入索引表，方便进行快速查找
          this.state.components?.set(item.id, item as T);
          this.updateDocument(targetDocument, key);
          resolve('添加物料成功');
        } else {
          reject('添加物料失败');
        }
      } catch (e) {
        console.error('添加物料失败', e);
        reject('添加物料失败');
      }
    });
  }

  /**
   * @description 获取物料
   * @param itemId
   * @param key
   */
  getComponent<T extends MaterialInterface.IMaterial>(itemId: string, key?: string): T | undefined {
    // 先从状态管理中获取
    let component: T | undefined;
    // component  = this.state.components.get(itemId) as unknown as T
    if (component !== void 0) {
      return component;
    } else {
      // 否则查询本地缓存
      let targetDocument: MaterialInterface.IDocument | undefined;
      if (key) {
        targetDocument  = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + key) || '{}');
      } else {
        targetDocument  = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}');
      }
      if (targetDocument !== void 0) {
        if (Array.isArray(targetDocument?.nodes)) {
          component = targetDocument.nodes.filter(item => item.id === itemId)[0] as T;
        }
      }
      return component;
    }
  }


  /**
   * @description 获取当前物料总数
   */
  get getComponentCount(): number {
    return this.state.components.size;
  }


  /**
   * @description 获取编排引擎实例
   */
  get getInstance(): IArrangement<T> {
    return this;
  }


  /**
   * @description 获取所有物料节点
   * @param documentId
   */
  getComponents(documentId?: string): T[] {
    return this.getAllElementNodes(documentId) as T[];
  }


  /**
   * @description 更新指定页面的指定物料节点
   * @param item
   * @param key 对应页面的主键
   */
  updateComponent(item: MaterialInterface.IMaterial, key?: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        let targetDocument: MaterialInterface.IDocument | undefined;
        if (key !== void 0) {
          targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + key) || '{}');
        } else {
          targetDocument  = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}');
        }
        if (targetDocument !== void 0) {
          targetDocument?.nodes?.forEach((node, index) => {
            if (node.id === item.id) {
              targetDocument?.nodes?.splice(index, 1, item);
            }
          });
          this.updateDocument(targetDocument, key);
          this.state.components?.set(item.id, item as T);
          resolve('更新物料成功');
        }
      } catch (e) {
        console.error('更新物料失败', e);
        reject('更新物料失败');
      }
    });
  }


  /**
   * @description 移动物料 相当于重构前 renderer 模块的 updateMaterialCSSAttribute api
   * @param item
   * @param position
   * @param key
   */
  moveComponent<K extends RenrenInterface.KeyValueIndexType<string, string>>(
    item: T,
    position: K[],
    key?: string
  ): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      try {
        if (item.props !== void 0 && item.props !== null) {
          if (Array.isArray(item.props.items) && item.props.items.length > 0) {
            item.props.items?.forEach((prop: MaterialInterface.IProp) => {
              const matchingAttr = position.find((item) => item.index === prop.type);
              if (matchingAttr) {
                prop.value = String(matchingAttr.value);
                prop.type = matchingAttr.index;
              }
            });
            // 更新属性
            await this.updateComponent(item, key);
            this.state.components.set(item.id, item);
            resolve(item);
          }
        }
      } catch (e) {
        console.error('移动物料失败', e);
        reject('移动物料失败');
      }
    });
  }

  /**
   * @description 移除物料节点 相当于重构前的 deleteNode api
   * @param itemId
   * @param documentId
   */
  removeComponent(itemId: string, documentId?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        let targetDocument: MaterialInterface.IDocument | undefined;
        if (documentId !== void 0) {
          targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + documentId) || '{}');
        } else {
          targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}');
        }
        if (targetDocument !== void 0) {
          targetDocument.nodes = targetDocument?.nodes?.filter(item => item.id !== itemId);
          this.state.components.delete(itemId);
          this.updateDocument(targetDocument, documentId);
          resolve('移除物料节点成功');
        } else {
          reject('移除物料节点失败');
        }
      } catch (e) {
        console.error('移除物料节点失败', e);
        reject('移除物料节点失败');
      }
    });
  }

  /**
   * @description 校验物料格式
   * @param item
   */
  verify(item: any): boolean {
    // TODO: 基于 zod 进行 schema json  的合法性检验
    return false;
  }

  /**
   * @description 创建页面 等同于重构前的 saveSchemaToJson api
   * @param params
   */
  createDocument(params: createDocument): void {
    try {
      const { name, schema } = params;
      const isExist: boolean = Object.keys(localStorage).filter(item => item.startsWith(SCHEMA_STORAGE_ID + name)).length > 0;
      if (isExist) {
        const db = new LocalforageDB();
        if (name) {
          db.insert(SCHEMA_STORAGE_ID + name, schema).catch(_ => {
            console.error('创建页面失败', _);
          });
          localStorage.setItem(SCHEMA_STORAGE_ID + name, JSON.stringify(schema));
        } else {
          db.insert(SCHEMA_STORAGE_ID, schema).catch(err => {
            console.error('创建页面失败', err);
          });
          localStorage.setItem(SCHEMA_STORAGE_ID, JSON.stringify(schema));
        }
      } else {
      }
    } catch (e) {
      console.error('创建页面失败', e);
    }
  }


  /**
   * @description 初始化页面
   * @param key
   * @param name
   */
  initDocument(key?: string, name?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        // 获取页面
        let document: MaterialInterface.IDocument | undefined = this.getDocument(key);
        // TODO: 存在 bug 无法成功创建页面初始化
        if (document === void 0) {
          let createParams: createDocument = {
            name: name || '',
            schema: documentSchema as unknown as MaterialInterface.IDocument,
            path: key || ''
          };
          console.log('create document');
          this.createDocument(createParams);
          resolve('页面初始化成功');
        }
        // let createParams: createDocument = {
        //   name: name || '',
        //   schema: documentSchema as unknown as MaterialInterface.IDocument,
        //   path: key || ''
        // };
        // localStorage.setItem(SCHEMA_STORAGE_ID, JSON.stringify(createParams.schema));
      } catch (e) {
        console.error('页面初始化失败', e);
        reject('页面初始化失败');
      }
    });
  }



  /**
   * @description 清空页面 等同于重构前的 clearMaterialNodes api
   */
  clear<D extends MaterialInterface.IDocument>(key?: string): Promise<string> {
    let targetDocument: D | undefined;
    if (key !== void 0) {
      targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + key) || '{}');
    } else {
      targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}');
    }
    if (targetDocument !== void 0) {
      targetDocument.nodes = [];
      this.updateDocument(targetDocument, key);
      this.state.components.clear();
    }
    return Promise.resolve('清空页面成功');
  }

  editDocument(documentId: string): MaterialInterface.IDocument | undefined {
    return undefined;
  }


  /**
   * @description 编辑页面名称
   * @param newName
   * @param oldName
   */
  editDocumentName(newName: string, oldName?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        let document: MaterialInterface.IDocument | undefined;
        if (oldName !== void 0) {
          document = this.getDocument(oldName);
        } else {
          document = this.getDocument();
        }
        if (document !== void 0) {
          document!.fileName = newName as string;
          if (oldName !== void 0) {
            this.updateDocument(document, oldName)
          } else {
            this.updateDocument(document);
          }
          resolve('success');
        }
      } catch (e) {
        console.error('页面更名失败', e);
        reject('页面更名失败');
      }
    });
  }


  /**
   * @description 获取当前页面信息 等同于重构前的 getSchema api
   * @param documentId
   */
  getDocument<T extends MaterialInterface.IDocument>(documentId?: string): T | undefined {
    return documentId !== void 0
      ?
      JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + documentId) || '{}')  as T
      :
      JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}')  as T
  }

  /**
   * @description 删除页面 对应重构前的 removeSchema api
   * @param documentId
   */
  removeDocument(documentId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        documentId
        ?
          localStorage.removeItem(SCHEMA_STORAGE_ID + documentId)
        :
          localStorage.removeItem(SCHEMA_STORAGE_ID)
        resolve('success');
      } catch (e) {
        console.error('删除页面失败', e);
        reject('删除页面失败');
      }
    });
  }

  /**
   * @description 更新页面属性 对应重构前的 updateDocumentPropNode api
   * @param props
   * @param key
   */
  updateDocumentProp(props: MaterialInterface.IProp[], key?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        let targetDocument: MaterialInterface.IDocument | undefined;
        if (key !== void 0) {
          targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + key) || '{}');
        } else {
          targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}');
        }
        if (targetDocument !== void 0) {
          if (targetDocument.prop !== null) {
            if (Array.isArray(targetDocument.prop.items) && targetDocument.prop.items.length > 0) {
              const nodes = targetDocument.prop.items ?? [];
              nodes.forEach((node, index) => {
                if (node.key === props[index].key) {
                  node.value = props[index].value;
                }
              });
              targetDocument.prop.items = nodes;
              this.updateDocument(targetDocument, key);
              resolve('更新页面属性成功');
            }
          }
        }
        reject('更新页面属性失败');
      } catch (e) {
        console.error('更新页面属性失败', e);
        reject('更新页面属性失败');
      }
    });
  }


  /**
   * @description 更新页面 对应重构前的 updateSchema api
   * @param item
   * @param name
   */
  updateDocument(item: MaterialInterface.IDocument, name?: string): void {
    if (name !== void 0) {
      localStorage.setItem(SCHEMA_STORAGE_ID + name, JSON.stringify(item));
    } else {
      localStorage.setItem(SCHEMA_STORAGE_ID, JSON.stringify(item));
    }
  }


  /**
   * @description 获取全部页面节点
   */
  getAllDocuments<K extends MaterialInterface.IDocument>(): Promise<K[]> {
    let result: K[] = [];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(SCHEMA_STORAGE_ID)) {
        result.push(JSON.parse(localStorage.getItem(key) || '{}') as K);
      }
    });
    return Promise.resolve(result);
  }



  /**
   * @description 获取当前页面的全部物料节点 对应重构前的 queryNodeList api
   * @param key
   */
  getAllElementNodes<T extends MaterialInterface.IDocument>(key?: string): MaterialInterface.IMaterial[] {
    let targetDocument: T | undefined;
    // 先从状态管理中获取
    // if (this.state.components.size > 0) {
    //   let result: MaterialInterface.IMaterial[] = [];
    //   if (key == void 0) {
    //     Object.values(this.state.components).forEach(item => {
    //       result.push(item);
    //     });
    //   }
    //   return result;
    // }
    if (key !== void 0) {
      targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID + key) || '{}') as T;
    } else {
      targetDocument = JSON.parse(localStorage.getItem(SCHEMA_STORAGE_ID) || '{}') as T;
    }
    return targetDocument.nodes || [];
  }


  /**
   * @description 获取当前项目信息
   * @param projectId
   */
  getSchemaTree<T extends MaterialInterface.IProject>(projectId?: string): T | undefined {
    return projectId !== void 0
    ?
    JSON.parse(localStorage.getItem(SCHEMA_PROJECT_STORAGE_ID + projectId) || '{}') as T
    :
    JSON.parse(localStorage.getItem(SCHEMA_PROJECT_STORAGE_ID) || '{}') as T
  }

  createProject(params: createProject): Promise<string> {
    return Promise.resolve("");
  }

  removeProject(projectId: string): Promise<string> {
    return Promise.resolve("");
  }
}


export default Arrangement;
