<script setup lang="ts">
/**
 * @description 组件对齐标线组件
 * @author FluffyChi-Xing
 */
import {ref} from 'vue';
import type { ComponentPublicInstance } from 'vue';
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";
import {mySchemaStore} from "@/stores/schema";
import {$util} from "@/componsables/utils";


const props = withDefaults(defineProps<{
  diff?: number; // 两个元素相聚 diff 的距离时产生吸附效果
  componentData?: RenrenMaterialModel[] | [];
}>(), {
  diff: 3,
  componentData: () => [],
});




const engine = container.resolve<IEngine>('engine');
const lineRefs = ref<Record<string, HTMLElement | null>>({});
const componentList = ref<RenrenMaterialModel[]>(props.componentData);
/** ===== 对齐标线-start ===== **/
const line = ref<string[]>(['xl', 'xm', 'xr', 'yt', 'ym', 'yb']); // x-left x-middle x-right etc.
const lineStatus: Map<string, boolean> = new Map<string, boolean>([
  ['xl', false], // x-left
  ['xm', false], // x-middle
  ['xr', false], // x-right
  ['yt', false], // y-top
  ['ym', false], // y-middle
  ['yb', false], // y-bottom
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



/**
 * @description 检查当前元素周围的其他元素之间的位置
 * 关系是否小于阈值，如果是就给对应的标线实例设置为显示
 * @param items
 * @param currentElement
 */
function checkNeighborsPosition(items: RenrenMaterialModel[] | undefined, currentElement: RenrenMaterialModel): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (Array.isArray(items) && items.length > 0) {
        items.forEach(async (comp) => {
          // 跳过当前组件
          if (comp?.id === currentElement?.id) return;
          const compStyleList: MaterialInterface.IProp[] | void = await engine.renderer.getComponentCSSAttr((currentElement as RenrenMaterialModel)?.id).catch(err => {
            console.error(err as string);
          });
          const compHalfWidth: number = compStyleList?.find(item => item.type === 'width')?.value / 2 || 0;
          const compHalfHeight: number = compStyleList?.find(item => item.type === 'height')?.value / 2 || 0;
          const top: number = compStyleList?.find(item => item.type === 'top')?.value || 0;
          const left: number = compStyleList?.find(item => item.type === 'left')?.value || 0;
          const need2Show = [];
          const curElementStyle: Record<string, string> = $util.canvas.getElementStyleRecord(currentElement);
          const conditions: MarkLineInterface.ILineCondition = {
            top: [
              // x-top 标线可能出现在当前元素向上移动或向下移动时
              {
                dragShift: top,
                isNearly: isNear(Number(curElementStyle['top']), top),
                line: 'xt',
                lineNode: lineRefs.value['xt'] || undefined,
                lineShift: top
              },
              {
                dragShift: top,
                isNearly: isNear(Number(curElementStyle['bottom']), top),
                line: 'xt',
                lineNode: lineRefs.value['xt'] || undefined,
                lineShift: top
              },
              {
                dragShift: top,
                isNearly: isNear(Number(curElementStyle['top']), top), // params2 -> currentEl.position params2 -> neighborEl.position
                line: 'xm', // 中线对齐
                lineNode: lineRefs.value['xm'] || undefined,
                lineShift: top + compHalfHeight,
              }
            ],
            left: [],
          };
        });
      }
    } catch (e) {
      console.error('获取邻近元素位置失败', e);
      reject('获取邻近元素位置失败');
    }
  });
}



function showLine(isDownward: boolean, isRightward: boolean): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const components: RenrenMaterialModel[] | [] = props.componentData;
      const curElement: RenrenMaterialModel | MaterialDocumentModel | void = mySchemaStore.currentElement;
      let curElementHalfWidth: number = 0;
      let curElementHalfHeight: number = 0;
      let curElementStyle: MaterialInterface.IProp[] | undefined = undefined;
      // 获取当前组件的宽度和高度
      if (curElement && curElement?.isMaterial()) {
        let element: RenrenMaterialModel = $util.renren.deepClone<RenrenMaterialModel>(curElement as RenrenMaterialModel);
        if (Array.isArray(element.props?.items) && element.props.items.length > 0) {
          element.props.items.forEach(async (item) => {
            // 获取当前选中组件的样式列表
            curElementStyle = await engine.renderer.getComponentCSSAttr((curElement as RenrenMaterialModel)?.id);
            // 通过在 displayItem 首次渲染的时候将元素尺寸保存到 schema 中，避免因为传参为 materialModel中不存在的属性而报错
            if (item.type === 'width') {
              curElementHalfWidth = item.value / 2;
            } else if (item.type === 'height') {
              curElementHalfHeight = item.value / 2;
            } else {
              curElementHalfHeight = 0;
              curElementHalfWidth = 0;
            }
          });
        }
      }
      // 先将 lineStatus 初始化为 false
      hideLine().catch(err => {
        reject(err as string);
      });
      // 检查周围元素与当前元素的位置关系，判断是否应该显示标线
      checkNeighborsPosition(components, curElement as RenrenMaterialModel);
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
