/**
 * @description 页面结构缓存
 */
import {defineStore} from "pinia";
import {ref} from "vue";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {PAGE_SCHEMA} from "@/componsables/constants/RenrenConstant";


export const useSchemaStore = defineStore('schema', () => {
  const schema = ref<MaterialDocumentModel>(new MaterialDocumentModel(PAGE_SCHEMA));
  const currentElement = ref<RenrenMaterialModel | MaterialDocumentModel | undefined>();
  const isAdd = ref<boolean>(false); // 新增物料标识

  const initCurrent = (item: RenrenMaterialModel | MaterialDocumentModel | undefined) => {
    currentElement.value = item;
  };
  return {
    schema,
    currentElement,
    initCurrent,
    isAdd,
  };
});
