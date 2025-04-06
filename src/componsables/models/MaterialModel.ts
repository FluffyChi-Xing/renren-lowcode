/**
 * @description 物料 models 模块
 * @author FluffyChi-Xing
 */
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {RenrenModel} from "@/componsables/models/RenrenModel";


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
  parent: MaterialInterface.IMaterial | null = null;
  props: MaterialInterface.IProps | null = null;
  icon: string | null = null;





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
      this.props = params.props ? params.props : null;
      this.parent = params.parent ? params.parent : null;
      this.zLevel = params.zLevel;
      this.children = params.children ? params.children : [];
      this.icon = params.icon ? params.icon : null;
    }
  }

  /**
   * @description 创建节点
   */
  createNode(): Promise<string> {
    return new Promise<string>((resolve, reject) => {

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
  id: string = '';
  size: number = 0;
  type: string = '';
  items: MaterialInterface.IProp[] | null = [];
  maps: Map<string, MaterialInterface.IProp> | undefined = undefined;
  owner: MaterialInterface.IMaterial | null = null;

  constructor(params?: MaterialInterface.IProps) {
    super();
    if (params) {
      this.id = params.id;
      this.size = params.size;
      this.type = params.type;
      this.items = params.items ? params.items : [];
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
  owner: MaterialInterface.IMaterial | null = null;
  parent: MaterialInterface.IProp | MaterialInterface.IProps | undefined = undefined;


  constructor(params?: MaterialInterface.IProp) {
    super();
    if (params) {
      this.code = params.code;
      this.key = params.key;
      this.type = params.type;
      this.value = params.value;
      this.items = params.items ? params.items : [];
      this.maps = new Map<string, MaterialInterface.IProp>();
      this.parent = params.parent;
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
  setOwner(owner: MaterialInterface.IMaterial): void {
    this.owner = owner;
  }


  /**
   * @description 设置父级物料属性
   * @param parent
   */
  setParent(parent: MaterialInterface.IProp | MaterialInterface.IProps): void {
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
