<script setup lang="ts">
import Grid from "@/components/Grid.vue";
import {useCanvasStore} from "@/stores/canvas";
import {computed, ref} from "vue";
import { debounce } from "lodash-es";
import Context from "@/components/Context.vue";
import {$message} from "@/componsables/element-plus";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import SelectArea from "@/components/SelectArea.vue";


const editor = ref();
const emits = defineEmits(['paste']);
const canvasStore = useCanvasStore();
const cursorX = ref<number>(0);
const cursorY = ref<number>(0);
const isShow = ref<boolean>(false);
const isShowArea = ref<boolean>(false);
const areaWidth = ref<number>(0);
const areaHeight = ref<number>(0);
const canvasSize = computed(() => {
  return {
    width: `${canvasStore.width}px`,
    height: `${canvasStore.height}px`,
  }
});
const selectAreaStart = ref<RenrenInterface.XAndYType<number, number>>({
  x: 0,
  y: 0
});
// const contextMenuList = ref<RenrenInterface.keyValueType<Function>[]>([
//   {
//     key: '粘贴',
//     value: () => emits('paste'),
//   }
// ]);


/**
 * @description 获取鼠标当前坐标
 * @param event
 */
function getCurrentCursorPosition<T extends MouseEvent>(event: T): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      // 禁用默认的右键菜单
      document.addEventListener('contextmenu', event => event.preventDefault());
      const { clientX, clientY } = event as T;
      const containerRect = editor.value?.getBoundingClientRect();
      cursorX.value = clientX - containerRect.left;
      cursorY.value = clientY - containerRect.top;
      // console.log('获取鼠标坐标成功', cursorX.value, cursorY.value);
      resolve('获取鼠标坐标成功');
    } catch (e) {
      console.log('获取鼠标坐标失败', e);
      reject('获取鼠标坐标失败');
    }
  });
}
/** ===== 鼠标选择框-start ===== **/

/**
 * @description 初始化鼠标按下事件
 * @param event
 */
function initMousedownEvent<T extends MouseEvent>(event: T): RenrenInterface.XAndYType<number, number> {
  const reactInfo = editor.value?.getBoundingClientRect();
  let editorX = reactInfo?.x;
  let editorY = reactInfo?.y;
  const startX = event.clientX;
  const startY = event.clientY;
  // console.log('鼠标按下', startX, startY, editorX, editorY);
  // 选中框的偏移量
  selectAreaStart.value.x = startX - editorX;
  selectAreaStart.value.y = startY - editorY;
  isShowArea.value = true;
  return {
    x: startX,
    y: startY
  }
}


/**
 * @description 处理鼠标移动事件
 * @param startX
 * @param startY
 */
function initMousemoveEvent(startX: number, startY: number) {
  return function (event: MouseEvent) {
    const currentX = event.clientX;
    const currentY = event.clientY;
    const editorRect = editor.value?.getBoundingClientRect();

    // 计算选区的宽度和高度
    areaWidth.value = Math.abs(currentX - startX);
    areaHeight.value = Math.abs(currentY - startY);

    // 计算选区的起始位置
    selectAreaStart.value.x = Math.min(currentX, startX) - editorRect?.x;
    selectAreaStart.value.y = Math.min(currentY, startY) - editorRect?.y;

    // console.log('鼠标移动', areaWidth.value, areaHeight.value, selectAreaStart.value.x, selectAreaStart.value.y);
  }
}



function resetData() {
  // areaWidth.value = 0;
  // areaHeight.value = 0;
  selectAreaStart.value.x = 0;
  selectAreaStart.value.y = 0;
}


/**
 * @description 鼠标抬起事件
 */
function mouseupHandler() {
  document.removeEventListener('mousemove', initMousemoveEvent(selectAreaStart.value.x, selectAreaStart.value.y));
  document.removeEventListener('mouseup', mouseupHandler);
  isShowArea.value = false;
  resetData();
}


/**
 * @description 处理鼠标选择事件
 * @param event
 */

function mousedownHandler<T extends MouseEvent>(event: T) {
  isShow.value = false; // 先清除右键菜单
  event.stopPropagation();
  areaHeight.value = 0;
  areaWidth.value = 0;
  resetData();
  const start = initMousedownEvent(event);
  document.addEventListener('mousemove', initMousemoveEvent(start.x, start.y));
  document.addEventListener('mouseup', mouseupHandler);
}
/** ===== 鼠标选择框-end ===== **/

/**
 * @description 处理画布右键点击事件
 * @param e
 */
function canvasRightClickHandler<T extends MouseEvent>(e: T) {
  isShow.value = false; // 先清除右键菜单
  getCurrentCursorPosition(e).then(() => {
    isShow.value = true;
  });
}


function handleContextClick(event: MouseEvent) {
  event.stopPropagation();
}

/**
 * @description 处理画布粘贴组件事件
 */
function pasteComp() {
  isShow.value = false;
  // $message({
  //   type: 'warning',
  //   message: '请先复制需要粘贴的组件'
  // });
}
</script>

<template>
  <el-scrollbar height="628">
    <div
      ref="editor"
      @click.right="canvasRightClickHandler"
      :style="`height: ${canvasStore.height}`"
      class="w-full flex flex-col items-center relative"
    >
      <!-- 网格线 -->
      <Grid
        @mousedown.left="mousedownHandler"
        :height="canvasSize.height"
        :width="canvasSize.width"
      />
      <!-- 右键单选框 -->
      <Context
        v-model:show="isShow"
        :top="cursorY"
        :left="cursorX"
        @click="handleContextClick"
        @paste="pasteComp"
      />
      <!-- 对齐标线 -->
      <!-- 鼠标拖拽区域 -->
      <SelectArea
        v-model:show="isShowArea"
        :start="selectAreaStart"
        :width="areaWidth"
        :height="areaHeight"
      />
      <!-- 物料容器 -->
    </div>
  </el-scrollbar>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
