<script setup lang="ts">
import Grid from "@/components/Grid.vue";
import {useCanvasStore} from "@/stores/canvas";
import {computed, ref} from "vue";
import { debounce } from "lodash-es";
import Context from "@/components/Context.vue";
import {$message} from "@/componsables/element-plus";
import {RenrenInterface} from "@/componsables/interface/RenrenInterface";


const previewContainer = ref();
const emits = defineEmits(['paste']);
const canvasStore = useCanvasStore();
const cursorX = ref<number>(0);
const cursorY = ref<number>(0);
const isShow = ref<boolean>(false);
const canvasSize = computed(() => {
  return {
    width: `${canvasStore.width}px`,
    height: `${canvasStore.height}px`,
  }
});
const contextMenuList = ref<RenrenInterface.keyValueType<Function>[]>([
  {
    key: '粘贴',
    value: () => emits('paste'),
  }
]);


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
      const containerRect = previewContainer.value?.getBoundingClientRect();
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


/**
 * @description 处理画布右键点击事件
 * @param e
 */
function canvasRightClickHandler(e) {
  isShow.value = false; // 先清除右键菜单
  getCurrentCursorPosition(e).then(() => {
    isShow.value = true;
  });
}


/**
 * @description 处理画布左键点击事件
 */
function canvasLeftClickHandler() {
  isShow.value = false;
}


/**
 * @description 处理画布粘贴组件事件
 */
function pasteComp() {
  $message({
    type: 'warning',
    message: '请先复制需要粘贴的组件'
  });
}
</script>

<template>
  <el-scrollbar height="628">
    <div
      ref="previewContainer"
      @click.right="canvasRightClickHandler"
      @click.left="canvasLeftClickHandler"
      :style="`height: ${canvasStore.height}`"
      class="w-full flex flex-col items-center"
    >
      <!-- 网格线 -->
      <Grid :height="canvasSize.height" :width="canvasSize.width" />
      <!-- 右键单选框 -->
      <Context
        v-model:show="isShow"
        :top="cursorY"
        :left="cursorX"
        @paste="pasteComp"
      />
      <!-- 对齐标线 -->
    </div>
  </el-scrollbar>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
