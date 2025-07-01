/**
 * @description 页面结构缓存
 */
import {defineStore} from "pinia";
import {ref} from "vue";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";



type SchemaState = {
  schema: MaterialDocumentModel | undefined;
  currentElement: RenrenMaterialModel | MaterialDocumentModel | undefined;
  initCurrent: (item: RenrenMaterialModel | MaterialDocumentModel | undefined) => void;
  isAdd: boolean;
  newElement: RenrenMaterialModel | undefined;
  elementInProcess: RenrenMaterialModel | undefined;
  copyMaterial: RenrenMaterialModel | undefined;
  currentElementId: string;
};





export const useSchemaStore = defineStore('schema', () => {
  const schema = ref<MaterialDocumentModel>();
  const currentElement = ref<RenrenMaterialModel | MaterialDocumentModel | undefined>();
  const isAdd = ref<boolean>(false); // 新增物料标识
  const newElement = ref<RenrenMaterialModel | undefined>();
  const elementInProcess = ref<RenrenMaterialModel | undefined>(); // 正在处理的元素
  const copyMaterial = ref<RenrenMaterialModel | undefined>();
  const currentElementId = ref<string>('');

  const initCurrent = (item: RenrenMaterialModel | MaterialDocumentModel | undefined) => {
    currentElement.value = item;
  };
  return {
    schema,
    currentElement,
    initCurrent,
    isAdd,
    newElement,
    elementInProcess,
    copyMaterial,
    currentElementId,
  };
});


export const mySchemaStore = useSchemaStore();
