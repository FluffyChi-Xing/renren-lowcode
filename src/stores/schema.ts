/**
 * @description 页面结构缓存
 */
import {defineStore} from "pinia";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";



type SchemaState = {
  schema: MaterialDocumentModel | undefined;
  currentElement: RenrenMaterialModel | MaterialDocumentModel | undefined;
  isAdd: boolean;
  newElement: RenrenMaterialModel | undefined;
  elementInProcess: RenrenMaterialModel | undefined;
  copyMaterial: RenrenMaterialModel | undefined;
  currentElementId: string;
};


type currentElType = MaterialInterface.IMaterial | MaterialInterface.IDocument | MaterialDocumentModel | RenrenMaterialModel | undefined;





const useSchemaStore = defineStore('schema', {
  state: (): SchemaState => ({
    copyMaterial: undefined,
    currentElement: undefined,
    currentElementId: "",
    elementInProcess: undefined,
    isAdd: false,
    newElement: undefined,
    schema: undefined
  }),


  getters: {
    getCopyMaterial(): RenrenMaterialModel | undefined {
      return this.copyMaterial;
    },
    getCurrentElement(): RenrenMaterialModel | MaterialDocumentModel | undefined {
      return this.currentElement;
    },
    getIsAdd(): boolean {
      return this.isAdd;
    },
    getNewElement(): RenrenMaterialModel | undefined {
      return this.newElement;
    },
    getElementInProcess(): RenrenMaterialModel | undefined {
      return this.elementInProcess;
    },
    getCurrentElementId(): string {
      return this.currentElementId;
    },
    getDocument(): MaterialDocumentModel | undefined {
      return this.schema;
    }
  },

  actions: {
    initCurrentElement(item: RenrenMaterialModel | MaterialDocumentModel | undefined): void {
      this.currentElement = item;
    },
    currentElementCallback(callback: Function): void {
      if (this.currentElement !== void 0) {
        callback(this.currentElement);
      }
    },
    isCurrentElementMaterialType(): boolean {
      if (this.currentElement !== void 0) {
        return this.currentElement.type === 'material';
      }
      return false;
    },
    initCurrentElement2undefined(): void {
      this.currentElement = undefined;
    },
    checkElementId(index: string): boolean {
      return index === this.currentElementId;
    },
    setNewElement(item: RenrenMaterialModel): void {
      this.newElement = item;
    },
    setCurrentElementId(index: string) {
      this.currentElementId = index;
    },
    setCurrentElement(item: currentElType, type?: 'material' | 'document' | 'none') {
      type = type || 'none'; // 默认是赋值为 undefined
      // 处理赋空值的情况
      if (item === void 0  && type === 'none') {
        this.currentElement = item;
        return;
      }
      // 处理对象赋值情况
      if (item instanceof RenrenMaterialModel || item instanceof MaterialDocumentModel) {
        this.currentElement = item;
      }
      if (type === 'material') {
        this.currentElement = new RenrenMaterialModel(item as MaterialInterface.IMaterial);
      } else {
        this.currentElement = new MaterialDocumentModel(item as MaterialInterface.IDocument);
      }
    },
    setCopyMaterial(item: RenrenMaterialModel | MaterialDocumentModel | undefined) {
      if (item === void 0) return;
      if (item?.type === 'document') return;
      this.copyMaterial = item as RenrenMaterialModel;
    }
  }
});


export default useSchemaStore;


export const mySchemaStore = useSchemaStore();
