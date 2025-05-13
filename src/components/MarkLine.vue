<script setup lang="ts">
import {ref} from 'vue';
import type { ComponentPublicInstance } from 'vue';
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {useSchemaStore} from "@/stores/schema";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {$engine} from "@/renren-engine/engine";


const props = withDefaults(defineProps<{
  diff?: number; // 两个元素相聚 diff 的距离时产生吸附效果
  componentData?: RenrenMaterialModel[] | [];
}>(), {
  diff: 3,
  componentData: () => [],
});




const schemaStore = useSchemaStore();
const line$Refs = ref<Record<string, HTMLElement | null>>({});
const componentList = ref<RenrenMaterialModel[]>(props.componentData);
/** ===== 对齐标线-start ===== **/
const line = ref<string[]>(['xl', 'xm', 'xr', 'yt', 'ym', 'yb']); // x-left x-middle x-right etc.
const lineStatus: Map<string, boolean> = new Map<string, boolean>([
  ['xl', false],
  ['xm', false],
  ['xr', false],
  ['yt', false],
  ['ym', false],
  ['yb', false],
]);


/**
 * @description 隐藏标线
 */
function hideLine(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      Object.keys(lineStatus).forEach(item => {
        lineStatus.set(item, false);
      });
    } catch (e) {
      console.error('隐藏标线失败', e);
      reject('隐藏标线失败');
    }
  });
}


/**
 * @description 设置 ref 到 line$Refs 中
 * @param el
 * @param item
 */
const setRef = (el: Element | ComponentPublicInstance | null, item: string) => {
  line$Refs.value[item] = el instanceof HTMLElement ? el : null;
};



function showLine(isDownward: boolean, isRightward: boolean): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const components: RenrenMaterialModel[] | [] = props.componentData;
      const currentElement: RenrenMaterialModel | MaterialDocumentModel | void = schemaStore.currentElement;
      let currentElementHalfWidth: number = 0;
      let currentElementHalfHeight: number = 0;
      let currentElementStyleList: MaterialInterface.IProp[] | undefined = undefined;
      // 获取当前组件的宽度和高度
      if (currentElement && currentElement.type === 'material') {
        (currentElement as RenrenMaterialModel).props?.items?.forEach(async (item) => {
          // 获取当前选中组件的样式列表
          currentElementStyleList = await $engine.renderer.queryMaterialCSSAttributesList(currentElement as RenrenMaterialModel);
          if (item.type === 'width') {
            currentElementHalfWidth = item.value / 2;
          } else if (item.type === 'height') {
            currentElementHalfHeight = item.value / 2;
          } else {
            currentElementHalfHeight = 0;
            currentElementHalfWidth = 0;
          }
        });
      }
      // 先将 lineStatus 初始化为 false
      hideLine().catch(err => {
        reject(err as string);
      });
      if (Array.isArray(components) && components.length > 0) {
        components.forEach(async (comp) => {
          if (comp === currentElement) return;
          const compStyleList: MaterialInterface.IProp[] | void = await $engine.renderer.queryMaterialCSSAttributesList(comp).catch(err => {
            console.error(err as string);
          });
          const compHalfWidth: number = compStyleList?.find(item => item.type === 'width')?.value / 2 || 0;
          const compHalfHeight: number = compStyleList?.find(item => item.type === 'height')?.value / 2 || 0;
          const top: number = compStyleList?.find(item => item.type === 'top')?.value || 0;
          const left: number = compStyleList?.find(item => item.type === 'left')?.value || 0;
          const need2Show = [];
          const conditions = {
            top: [],
            left: [],
          };
        });
      }
    } catch (e) {
      console.error('显示标线失败', e);
      reject('显示标线失败');
    }
  });
}
/** ======= 对齐标线-end ===== **/
</script>

<template>
  <div
    v-for="(item, index) in line"
    v-show="lineStatus.get(item) || false"
    :key="index"
    :ref="(el) => setRef(el, item)"
    class="absolute z-[9999] bg-blue-500"
    :class="line.includes('x') ? 'xAxis' : 'yAxis'"
  />
</template>

<style scoped>
.xAxis {
  width: 100%;
  height: 1px;
}


.yAxis {
  height: 100%;
  width: 1px;
}
</style>
