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
  id: string;
  isLocked: boolean;
  hidden: boolean;
  isNode: boolean;
  condition: string;
  conditionGroup: string;
  title: string;
  props: MaterialPropsModel;
  parent: RenrenMaterialModel;
  zLevel: number;
  children: RenrenMaterialModel[];

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
      this.props = params.props ? new MaterialPropsModel() : null;
      this.parent = params.parent ? new RenrenMaterialModel(params.parent) : null;
      this.zLevel = params.zLevel;
      this.children = params.children ? params.children.map(item => new RenrenMaterialModel(item)) : [];
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
      if (this.children?.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
}



export class MaterialPropsModel extends RenrenModel implements MaterialInterface.IProps {
  id: string;
  items: MaterialPropModel[];
  maps: Map<string, MaterialInterface.IProp>;
  owner: RenrenMaterialModel;
  size: number;
  type: string;
  constructor(params?: MaterialInterface.IProps) {
    super();
    if (params) {
      this.id = params.id;
      this.size = params.size;
      this.type = params.type;
      this.items = params.items ? params.items.map(item => new MaterialPropModel(item)) : [];
      this.maps = new Map<string, MaterialInterface.IProp>();
      this.owner = params.owner ? new RenrenMaterialModel(params.owner) : null;
    }
  }


  /**
   * @description 插入新的物料属性
   * @param params
   */
  add(params: MaterialInterface.IProp): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        this.items.push(new MaterialPropModel(params));
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
        this.items = this.items.filter(item => item.key !== key);
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
  getProp(key: string): MaterialPropModel {
    this.items.find(item => item.key === key);
  }
}



export class MaterialPropModel extends RenrenModel implements MaterialInterface.IProp {
  code: string;
  items: MaterialPropModel[];
  key: string; // 属性主键
  maps: Map<string, MaterialInterface.IProp>;
  owner: RenrenMaterialModel;
  parent: MaterialPropModel | MaterialPropsModel;
  type: string;
  value: any;

  constructor(params?: MaterialInterface.IProp) {
    super();
    if (params) {
      this.code = params.code;
      this.key = params.key;
      this.type = params.type;
      this.value = params.value;
      this.items = params.items ? params.items.map(item => new MaterialPropModel(item)) : [];
      this.maps = new Map<string, MaterialInterface.IProp>();
      this.parent = null;
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
  setOwner(owner: RenrenMaterialModel): void {
    this.owner = owner;
  }


  /**
   * @description 设置父级物料属性
   * @param parent
   */
  setParent(parent: MaterialPropModel | MaterialPropsModel): void {
    this.parent = parent;
  }
}


export class MaterialChildrenModel extends RenrenModel implements MaterialInterface.INodeChildren {
  children: RenrenMaterialModel[];
  owner: RenrenMaterialModel;
  size: number;

  constructor(params?: MaterialInterface.INodeChildren) {
    super();
    if (params) {
      this.children = params.children ? params.children.map(item => new RenrenMaterialModel(item)) : [];
      this.size = params.size;
    }
  }


  /**
   * @description 设置物料节点的父级
   * @param owner
   */
  setOwner(owner: RenrenMaterialModel): void {
    this.owner = owner;
  }


  /**
   * @description 插入新物料
   * @param params
   */
  insert(params: MaterialInterface.IMaterial): void {
    this.children.push(new RenrenMaterialModel(params));
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
