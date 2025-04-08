/**
 * @description 页面结构缓存
 */
import {defineStore} from "pinia";
import {ref} from "vue";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {PAGE_SCHEMA} from "@/componsables/constants/RenrenConstant";


export const useSchemaStore = defineStore('schema', () => {
  const schema = ref<MaterialDocumentModel>(new MaterialDocumentModel(PAGE_SCHEMA));
  const currentElement = ref<RenrenMaterialModel | MaterialDocumentModel>();

  const initCurrent = (item: RenrenMaterialModel | MaterialDocumentModel) => {
    currentElement.value = item;
  };
  return {
    schema,
    currentElement,
    initCurrent
  };
}, {
  persist: true
});
