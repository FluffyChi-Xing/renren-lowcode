/**
 * @description 状态管理库 工具类模块
 * @author FluffyChi-Xing
 */
import {mySchemaStore} from "@/stores/schema";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";


/**
 * @description 判断当前选中的元素是否是一个物料元素
 */
export function isCurrentElementAMaterial(): boolean {
  return mySchemaStore.currentElement?.type === 'material' && mySchemaStore.currentElement !== void 0;
}


/**
 * @description 判断当前选中的元素是否是一个文档元素
 */
export function isCurrentElementADocument(): boolean {
  return mySchemaStore.currentElement?.type === 'document' && mySchemaStore.currentElement !== void 0;
}


/**
 * @description 判断当前物料元素是否为空元素
 */
export function isCurrentMaterialEmpty(): boolean {
  if (isCurrentElementAMaterial()) {
    const material = mySchemaStore.currentElement as RenrenMaterialModel;
    return Object.keys(material).length === 0 && material.constructor === Object;
  } else {
    return false;
  }
}


/**
 * @description 获取当前选中的物料元素
 */
export function getCurrentMaterial<T extends RenrenMaterialModel>(): T | undefined {
  if (isCurrentElementAMaterial()) {
    return mySchemaStore.currentElement as T;
  } else {
    return undefined;
  }
}
