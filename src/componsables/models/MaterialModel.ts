/**
 * @description 物料 models 模块
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {RenrenModel} from "@/componsables/models/RenrenModel";
import {SCHEMA_STORAGE_ID} from "@/componsables/constants/RenrenConstant";
import {$engine} from "@/renren-engine/engine";


/**
 * @description 物料模型
 */
export class RenrenMaterialModel extends RenrenModel implements MaterialInterface.IMaterial {
  id: string = '0';
  isLocked: boolean = false;
  hidden: boolean = false;
  isNode: boolean = false;
  condition: string = '';
  conditionGroup: string = '';
  title: string = ''
  zLevel: number = 0;
  children: MaterialInterface.IMaterial[] | null = null;
  parent: string | null = null;
  props: MaterialInterface.IProps | null = null;
  icon: string = '';





  constructor(params?: MaterialInterface.IMaterial) {
    super();
    if (params) {
      this.id = params.id;
      this.isLocked = params.isLocked;
      this.hidden = params.hidden;
      this.isNode = params.isNode;
      this.condition = params.condition;
      this.conditionGroup = params.conditionGroup;
      this.title = params.title;
      this.props = params.props ? params.props as unknown as MaterialPropsModel : null;
      this.parent = params.parent ? params.parent : null;
      this.zLevel = params.zLevel;
      this.children = params.children ? params.children.map(child => new RenrenMaterialModel(child)) : [];
      this.icon = params.icon ? params.icon : '';
    }
  }

  /**
   * @description 创建节点
   */
  createNode(params: MaterialInterface.IMaterial): Promise<RenrenMaterialModel> {
    return new Promise<RenrenMaterialModel>((resolve, reject) => {
      try {
        if (params) {
          const node = new RenrenMaterialModel(params);
          resolve(node);
        } else {
          reject('创建节点失败');
        }
      } catch (e) {
        console.log('创建节点失败', e);
        reject('创建节点失败');
      }
    });
  }

  /**
   * @description 销毁节点
   */
  destroyNode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {

    });
  }

  /**
   * @description 是否存在节点
   */
  hasNode(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.children) {
        if (this.children?.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  }
}



export class MaterialPropsModel extends RenrenModel implements MaterialInterface.IProps {
  readonly id: string = '';
  size: number = 0;
  type: string = '';
  items: MaterialInterface.IProp[] | null = [];
  maps: Map<string, MaterialInterface.IProp> | undefined = undefined;
  owner: string | null = null;

  constructor(params?: MaterialInterface.IProps) {
    super();
    if (params) {
      this.id = params.id;
      this.size = params.size;
      this.type = params.type;
      this.items = params.items ? params.items.map(item => new MaterialPropModel(item)) : [];
      this.maps = new Map<string, MaterialInterface.IProp>();
      this.owner = params.owner ? params.owner : null;
    }
  }


  /**
   * @description 插入新的物料属性
   * @param params
   */
  add(params: MaterialInterface.IProp): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        if (this.items) {
          this.items.push(params);
        }
        resolve('插入新的物料属性成功');
      } catch (e) {
        console.log('插入新的物料属性失败', e);
        reject('插入新的物料属性失败');
      }
    })
  }


  /**
   * @description 删除物料属性
   * @param key
   */
  delete(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        if (this.items) {
          this.items = this.items.filter(item => item.key !== key);
        }
      } catch (e) {
        console.log('删除物料属性失败', e);
        reject('删除物料属性失败');
      }
    });
  }


  /**
   * @description 获取物料的特定属性
   * @param key
   */
  getProp(key: string): MaterialInterface.IProp | undefined {
    if (this.items) {
      if (this.items?.length > 0) {
        return this.items.find(item => item.key === key);
      }
    }
  }
}



export class MaterialPropModel extends RenrenModel implements MaterialInterface.IProp {
  code: string = '';
  key: string = ''; // 属性主键
  maps: Map<string, MaterialInterface.IProp> | undefined = undefined;
  type: string = '';
  value: any;
  items: MaterialInterface.IProp[] | null = [];
  owner: string | null = null;
  parent: string | undefined = undefined;


  constructor(params?: MaterialInterface.IProp) {
    super();
    if (params) {
      this.code = params.code;
      this.key = params.key;
      this.type = params.type;
      this.value = params.value;
      this.items = params.items ? params.items.map(item => new MaterialPropModel(item)) : [];
      this.maps = new Map<string, MaterialInterface.IProp>();
      this.parent = params.parent ? params.parent : undefined;
      this.owner = params.owner ? params.owner : null;
    }
  }


  /**
   * @description 获取物料属性值
   */
  getValue(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        resolve(this.value);
      } catch (e) {
        console.log('获取物料属性值失败', e);
        reject('获取物料属性值失败');
      }
    });
  }


  /**
   * @description 更新物料属性值
   * @param newVal
   */
  setValue(newVal: any):void {
    this.value = newVal;
  }

  /**
   * @description 设置物料节点的父级
   * @param owner
   */
  setOwner(owner: string): void {
    this.owner = owner;
  }


  /**
   * @description 设置父级物料属性
   * @param parent
   */
  setParent(parent: string): void {
    this.parent = parent;
  }
}


export class MaterialChildrenModel extends RenrenModel implements MaterialInterface.INodeChildren {
  size: number = 0;
  children: MaterialInterface.IMaterial[] = [];
  owner: MaterialInterface.IMaterial | null = null;


  constructor(params?: MaterialInterface.INodeChildren) {
    super();
    if (params) {
      this.children = params.children ? params.children : [];
      this.size = params.size;
    }
  }


  /**
   * @description 设置物料节点的父级
   * @param owner
   */
  setOwner(owner: MaterialInterface.IMaterial): void {
    this.owner = owner;
  }


  /**
   * @description 插入新物料
   * @param params
   */
  insert(params: MaterialInterface.IMaterial): void {
    this.children.push(params);
  }


  /**
   * @description 删除物料节点
   * @param key
   */
  delete(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        this.children = this.children.filter(item => item.id !== key);
      } catch (e) {
        console.log('删除物料失败', e);
        reject('删除物料失败');
      }
    });
  }
}

/**
 * @description 文档节点模型
 */
export class MaterialDocumentModel extends RenrenModel implements MaterialInterface.IDocument {
  activated: boolean = false;
  blank: boolean = true;
  fileName: string | null = null;
  nodes: MaterialInterface.IMaterial[] | undefined;
  opened: boolean = false;
  rootNode: boolean = true;
  sections: MaterialInterface.IMaterial[] | undefined;
  prop: MaterialInterface.IProps | null = null;


  constructor(params?: MaterialInterface.IDocument) {
    super();
    if (params) {
      this.activated = params.activated;
      this.blank = params.blank;
      this.fileName = params.fileName;
      this.nodes = params.nodes ? params.nodes.map(node => new RenrenMaterialModel(node)) : [];
      this.opened = params.opened;
      this.rootNode = params.rootNode;
      this.sections = params.sections ? params.sections.map(section => new RenrenMaterialModel(section)) : [];
      this.prop = params.prop ? params.prop : null;
    }
  }
}


/**
 * @description 物料节点树型模型类
 */
export class MaterialTreeModel extends RenrenModel implements MaterialInterface.MaterialTreeType {
  children: MaterialInterface.MaterialTreeType[] = [];
  icon: string = '';
  index: number | string = '';
  name: string = '';
  parentId: number | string = '';


  constructor(params?: MaterialInterface.MaterialTreeType) {
    super();
    if (params) {
      this.children = params.children? params.children : [];
      this.icon = params.icon ? params.icon : '';
      this.index = params.index;
      this.parentId = params.parentId ? params.parentId : '';
      this.name = params.name;
    }
  }
}





export class MaterialProjectModel extends RenrenModel implements MaterialInterface.IProject {
  currentDocument: MaterialInterface.IDocument | undefined;
  documents: MaterialInterface.IDocument[] | undefined;
  documentsMap: Map<string, MaterialInterface.IDocument> | undefined;
  props: MaterialInterface.IProps[] | undefined;
  simulatorHost: string = '';
  projectId: string = '';
  projectName: string = '';
  projectPath: string = '';

  constructor(params?: MaterialInterface.IProject) {
    super();
    if (params) {
      this.currentDocument = params.currentDocument? params.currentDocument : undefined;
      this.documents = params.documents? params.documents.map(doc => new MaterialDocumentModel(doc)) : [];
      this.documentsMap = new Map<string, MaterialInterface.IDocument>();
      this.props = params.props? params.props.map(prop => new MaterialPropsModel(prop)) : [];
      this.simulatorHost = params.simulatorHost;
      this.projectPath = params.projectPath;
      this.projectName = params.projectName;
      this.projectId = params.projectId;
    }
  }


  /**
   * @description 在项目内创建新的文档节点
   * @param params
   */
  createDocument(params?: MaterialInterface.createDocumentParamsType): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (params) {
          // 新建文档节点参数列表
          const documentParams: MaterialInterface.IDocument = {
            rootNode: params.isRoot,
            nodes: undefined,
            fileName: params.fileName,
            opened: params.opened,
            blank: true,
            activated: false,
            sections: undefined,
            prop: params.prop,
          };
          const documentModel: MaterialDocumentModel = new MaterialDocumentModel({...documentParams});
          // 检查是否存在同名页面
          const storageId: string = SCHEMA_STORAGE_ID + params?.fileName;
          const doc = await $engine.getSchema(storageId);
          if (!doc) {
            // 保存文档节点
            await $engine.saveSchemaToJson(documentModel, params.fileName).catch(err => {
              reject(err);
            });
            // 保存文档节点到项目保存文档节点到项目
            await $engine.saveDocument2Project(params.projectName, documentParams).catch(err => {
              reject(err);
            });
            resolve('创建文档成功');
          }
        } else {
          reject('参数错误');
        }
      } catch (e) {
        console.error('创建文档失败', e);
        reject('创建文档失败');
      }
    });
  }


  /**
   * @description 删除文档节点
   * @param documentName
   */
  removeDocument(documentName: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        // 删除本地缓存的文档节点
        await $engine.removeSchema(SCHEMA_STORAGE_ID + documentName).catch(err => {
          reject(err);
        });
        await $engine.removeDocumentFromProject(documentName, this.projectName).catch(err => {
          reject(err);
        })
        // 移除项目内的文档节点
        resolve('删除文档成功');
      } catch (e) {
        console.error('删除文档失败', e);
      }
    });
  }
}
