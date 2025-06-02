<script setup lang="ts">
/**
 * @description 组件对齐标线组件
 * @author FluffyChi-Xing
 */
import {onMounted, ref} from 'vue';
import type { ComponentPublicInstance } from 'vue';
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";
import {mySchemaStore} from "@/stores/schema";
import $event from "@/componsables/utils/EventBusUtil";
import {$util} from "@/componsables/utils";


const props = withDefaults(defineProps<{
  diff?: number; // 两个元素相聚 diff 的距离时产生吸附效果
}>(), {
  diff: 3,
});




const engine = container.resolve<IEngine>('engine');
const lineRefs = ref<Record<string, HTMLElement | null>>({});
const componentList = ref<MaterialInterface.IMaterial[]>([]);
// 开始计算标线的阈值为当 当前元素距离其他元素的距离为当前元素的 width 时开始计算
/** ===== 对齐标线-start ===== **/
const line = ref<string[]>(['xt', 'xm', 'yl', 'ym']);
const lineStatus: Map<string, boolean> = new Map<string, boolean>([
  ['xt', false], // x-top
  ['xm', false], // x-middle
  ['yl', false], // y-left
  ['ym', false], // y-middle
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
      resolve('success');
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
  lineRefs.value[item] = el instanceof HTMLElement ? el : null;
};


/**
 * @description 判断当前元素与周围的其他元素的距离关系是否靠近
 * @param curValue
 * @param targetValue
 */
function isNear(curValue: number, targetValue: number): boolean {
  // 计算当前选中(正在拖动的组件的位置与周围其他元素的位置之差知否小于吸附距离)
  return Math.abs(curValue - targetValue) <= props.diff;
}


function showLine<T extends MaterialInterface.IMaterial>(isDownward?: boolean, isRightward?: boolean): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      // 当前页面的所有元素节点
      const components: T[] = componentList.value as T[];
      let curElement: MaterialInterface.IMaterial | undefined;
      let curElementWidth: string = '0';
      let curElementHeight: string = '0';
      curElement = engine.arrangement.getComponent(mySchemaStore.currentElementId);
      if (curElement !== void 0) {
        // TODO: 计算当前元素的宽高属性
        curElementWidth = $util.canvas.getCompTargetProp(curElement, 'width')?.value || '0';
        curElementHeight = $util.canvas.getCompTargetProp(curElement, 'height')?.value || '0';
        console.log('当前元素宽高', curElementWidth, curElementHeight);
      }
      // 先将 lineStatus 初始化为 false
      hideLine().catch(err => {
        reject(err as string);
      });
      // 检查周围元素与当前元素的位置关系，判断是否应该显示标线
    } catch (e) {
      console.error('显示标线失败', e);
      reject('显示标线失败');
    }
  });
}
/** ======= 对齐标线-end ===== **/



onMounted(() => {
  // 获取当前页面的所有元素
  componentList.value = engine.arrangement.getAllElementNodes();
  showLine();
});



$event.on('updateShape', () => {
  showLine();
});
</script>

<template>
  <div
    v-for="(item, index) in line"
    v-show="lineStatus.get(item) || false"
    :key="index"
    :ref="(el) => setRef(el, item)"
    class="absolute z-[9999] bg-blue-500"
    :class="item.startsWith('x') ? 'xAxis' : 'yAxis'"
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
