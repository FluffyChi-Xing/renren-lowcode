import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {MaterialRespDto} from "@/componsables/interface/dto/resp/MaterialRespDto";

export const useCounterStore = defineStore('counter', () => {


  const defaultMaterialList = ref<MaterialRespDto.defaultMaterialList>();

  const selfMaterialList = ref<MaterialRespDto.MaterialInfoRespDto[]>([]);

  return {
    defaultMaterialList,
    selfMaterialList,
  };
})


export const myCounterStore = useCounterStore();
