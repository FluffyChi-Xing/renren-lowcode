<script setup lang="ts">
/**
 * @description 组件对齐标线组件
 * @author FluffyChi-Xing
 */
import {onMounted, ref} from 'vue';
import type { ComponentPublicInstance } from 'vue';
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


type currentElPosition = {
  width: string;
  height: string;
  left: string;
  top: string;
}






const engine = container.resolve<IEngine>('engine');
const lineRefs = ref<Record<string, HTMLElement | null>>({});
const componentList = ref<MaterialInterface.IMaterial[]>([]);
// 开始计算标线的阈值为当 当前元素距离其他元素的距离为当前元素的 width 时开始计算
/** ===== 对齐标线-start ===== **/
const line = ref<string[]>(['xt', 'xm', 'xb', 'yl', 'ym', 'yr']);
const lineStatus = ref<Map<string, boolean>>(new Map<string, boolean>([
  ['xt', false], // x-top
  ['xm', false], // x-middle
  ['yl', false], // y-left
  ['ym', false], // y-middle
  ['yr', false], // y-right
  ['xb', false], // x-bottom
]));


/**
 * @description 隐藏标线
 */
function hideLine(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      lineStatus.value.forEach((_, index) => {
        lineStatus.value.set(index, false);
      })
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
 * @description 计算周围元素与当前元素之间的距离关系
 * @param config
 * @param item
 */
function checkAroundPosition(config: currentElPosition, item: MaterialInterface.IMaterial) {
  const { width, height, left, top } = config;
  let conditions: Record<string, MarkLineInterface.ILineConfig[]> = {
    top: [],
    left: []
  };
  let compWidth: number = 0;
  let compHeight: number = 0;
  let compLeft: number = 0;
  let compTop: number = 0;
  if (item !== void 0) {
    // 跳过元素本身
    if (mySchemaStore.checkElementId(item.id)) return conditions;
    compWidth = Number($util.canvas.getCompTargetProp(item, 'width')?.value) || 0;
    compHeight = Number($util.canvas.getCompTargetProp(item, 'height')?.value) || 0;
    compLeft = Number($util.canvas.getCompTargetProp(item, 'left')?.value) || 0;
    compTop = Number($util.canvas.getCompTargetProp(item, 'top')?.value) || 0;
  }
  if (lineRefs.value !== void 0) {
    conditions['top'] = [
      {
        dragShift: compTop,
        isNearly: isNear(Number(top), compTop),
        line: "xt",
        lineNode: lineRefs.value['xt'] as HTMLElement,
        lineShift: compTop
      },
      {
        dragShift: compTop + compHeight,
        isNearly: isNear(Number(top), compTop + compHeight),
        line: "xb",
        lineNode: lineRefs.value['xb'] as HTMLElement,
        lineShift: compTop + compHeight
      },
    ];
    conditions['left'] = [
      // y-left
      {
        dragShift: compLeft,
        isNearly: isNear(Number(left), compLeft),
        line: "yl",
        lineNode: lineRefs.value['yl'] as HTMLElement,
        lineShift: compLeft
      },
      // y-right
      {
        dragShift: compLeft + compWidth,
        isNearly: isNear(Number(left), compLeft + compWidth) || isNear(compLeft + compWidth, Number(left)),
        line: "yr",
        lineNode: lineRefs.value['yr'] as HTMLElement,
        lineShift: compLeft + compWidth
      }
    ];
  }
  Object.keys(conditions).forEach(index => {
    conditions[index].forEach(item => {
      if (lineRefs.value !== void 0) {
        // 清除样式
        if (lineRefs.value[item.line] !== void 0) {
          if (item.line.startsWith('x')) {
            (lineRefs.value[item.line] as HTMLElement).style!.top  = item?.lineShift + 'px';
          } else {
            (lineRefs.value[item.line] as HTMLElement).style!.left  = item?.lineShift + 'px';
          }
        }
      }
      lineStatus.value.set(item.line, item.isNearly);
    });
  });
}

/**
 * @description 显示标线
 */
function showLine(): void {
  let curElement: MaterialInterface.IMaterial | undefined;
  let curElementWidth: string = '0';
  let curElementHeight: string = '0';
  let curElementLeft: string = '0';
  let curElementTop: string = '0';
  curElement = engine.arrangement.getComponent(mySchemaStore.getCurrentElementId);
  if (curElement !== void 0) {
    curElementWidth = $util.canvas.getCompTargetProp(curElement, 'width')?.value || '0';
    curElementHeight = $util.canvas.getCompTargetProp(curElement, 'height')?.value || '0';
    curElementTop  = $util.canvas.getCompTargetProp(curElement, 'top')?.value || '0';
    curElementLeft  = $util.canvas.getCompTargetProp(curElement, 'left')?.value || '0';
  }
  let config: currentElPosition = {
    width: curElementWidth,
    height: curElementHeight,
    left: curElementLeft,
    top: curElementTop
  };
  // 检查周围元素与当前元素的位置关系，判断是否应该显示标线
  // 要显示标线的前提是目前至少有两个或两个以上的元素
  if (Array.isArray(componentList.value) && componentList.value.length > 1) {
    componentList.value.forEach(item => {
      if (item !== void 0) {
        checkAroundPosition(config, item);
      }
    });
  }
}
/** ======= 对齐标线-end ===== **/



onMounted(() => {
  // 获取当前页面的所有元素
  componentList.value = engine.arrangement.getAllElementNodes();
  hideLine();
  showLine();
});



$event.on('updateShape', () => {
  componentList.value = engine.arrangement.getAllElementNodes();
  hideLine();
  showLine();
});


$event.on('clearCanvas', () => {
  hideLine();
});


$event.on('dragover', () => {
  hideLine();
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
  width: 100% !important;
  height: 1px;
}


.yAxis {
  height: 100% !important;
  width: 1px;
}
</style>
