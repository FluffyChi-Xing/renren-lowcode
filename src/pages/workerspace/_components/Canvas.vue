<script setup lang="ts">
import Grid from "@/components/Grid.vue";
import {useCanvasStore} from "@/stores/canvas";
import {computed, onMounted, ref, watch} from "vue";
import Context from "@/components/Context.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import SelectArea from "@/components/SelectArea.vue";
import type {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {getCursorPosition, getDataTransformMaterial} from "@/componsables/utils/CanvasUtil";
import {createCSSAttributes, updateMaterialCSSAttribute} from "@/renren-engine/renderer/renderer";
import {getPersistNodeList, insertNode2Document} from "@/renren-engine/arrangement/arrangement";
import {$message} from "@/componsables/element-plus";
import DisplayItem from "@/components/DisplayItem.vue";
import {MAX_CANVAS_WIDTH} from "@/componsables/constants/CanvasConstant";



const props = withDefaults(defineProps<{
  clearFlag?: boolean; // 清空画布标识
}>(), {
  clearFlag: false
});





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
const materialContainer = ref<RenrenMaterialModel[]>([]);
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
/** ===== 画布拖拽业务-start ===== **/

/**
 * @description 处理拖拽结束事件
 * @param e
 */
function handleDragover(e: DragEvent) {
  if (e) {
    e.preventDefault();
  }
}


/**
 * @description 处理物料拖入事件
 * @param e
 */
async function handleDragEvent<T extends RenrenMaterialModel>(e: DragEvent) {
  // 接受物料
  if (e) {
    // 获取位置信息
    let material: T = getDataTransformMaterial(e) as T;
    if (material) {
      // 设置 props
      let position = {
        x: 0,
        y: 0
      };
      if (editor.value) {
        position = await getCursorPosition(e, editor.value, 300);
        // console.log('position', position);
      }
      const prop: RenrenInterface.KeyValueIndexType<string, string> = {
        key: 'style',
        value: `left: ${position.x}px;top: ${position.y}px;`,
        index: 'string'
      };
      // 注册物料到 materialContainer & schema
      material = await createCSSAttributes(material, [prop]);
      materialContainer.value.push(material);
      // 保存 schema
      await insertNode2Document(material).catch(err => {
        $message({
          type: 'warning',
          message: err
        });
      });
    }
  }
}


/**
 * @description 处理物料拖拽事件
 * @param item
 * @param event
 */
async function materialMousemoveHandler<T extends RenrenMaterialModel>(item: T, event?: DragEvent) {
  // let material: T = await getSchema();
  let node: RenrenMaterialModel | void;
  // 获取物料拖动位置
  let position = {
    x: 0,
    y: 0
  };
  if (editor.value) {
    position = await getCursorPosition(event, editor.value, 500);
  }
  const prop: RenrenInterface.KeyValueIndexType<string, string> = {
    key: 'style',
    value: `left: ${position.x}px;top: ${position.y}px;`,
    index: 'string'
  };
  // 更新 schema
  node = await updateMaterialCSSAttribute(item.id, prop).catch(err => {
    $message({
      type: 'warning',
      message: err,
    });
  });
  if (node) {
    materialContainer.value = materialContainer.value.map(item => {
      if (item.id === node.id) {
        return node;
      }
      return item;
    });
  }
  // console.log('position', prop, item);
}
/** ===== 画布拖拽业务-end ===== **/
/**
 * @description 保持物料容器数据持久化
 */
async function keepMaterialAlive() {
  const nodes: RenrenMaterialModel[] | void = await getPersistNodeList().catch((err: string) => {
    $message({
      type: 'warning',
      message: err
    });
  });
  if (nodes && nodes.length > 0) {
    materialContainer.value = nodes;
  }
}


/**
 * @description 监听 clearFlag 变化
 */
watch(() => props.clearFlag, (newVal: boolean) => {
  if (newVal) {
    materialContainer.value = []; // 清空物料容器
  }
});


/**
 * @description 页面挂载时，保持物料容器数据持久化
 */
onMounted(async () => {
  await keepMaterialAlive();
});
</script>

<template>
  <el-scrollbar height="628">
    <div
      ref="editor"
      @click.right="canvasRightClickHandler"
      @dragover="handleDragover"
      @drop="handleDragEvent"
      :style="`height: ${canvasStore.height}px;width: ${MAX_CANVAS_WIDTH}px;`"
      class="w-full flex items-center justify-center relative"
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
      <DisplayItem
        v-for="(item, index) in materialContainer"
        :key="index"
        :item="item"
        @move="materialMousemoveHandler(item, $event)"
      />
    </div>
  </el-scrollbar>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
