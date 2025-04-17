import {defineStore} from "pinia";
import { ref } from "vue";


/**
 * @description 画布状态管理
 */
export const useCanvasStore = defineStore('canvas', () => {
  const height = ref<number>(720);
  const width = ref<number>(1080);
  const isAdd = ref<string>('000');
  const canvasColor = ref<string>('#ffffff');


  return {
    height,
    width,
    isAdd,
    canvasColor,
  };
});
