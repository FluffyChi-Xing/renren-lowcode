/**
 * @description 页面结构缓存
 */
import {defineStore} from "pinia";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {ref} from "vue";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";


const pageSchema = ref<MaterialInterface.IMaterial>(
  {
    isNode: true,
    title: '页面',
    isLocked: false,
    condition: '',
    conditionGroup: '',
    hidden: false,
    id: generateUUID(),
    children: [],
    parent: null,
    zLevel: 0,
    props: null,
  }
);


export const useSchemaStore = defineStore('schema', () => {
  const schema = ref<RenrenMaterialModel>(new RenrenMaterialModel(pageSchema.value));


  return {
    schema,
  };
}, {
  persist: true
});
