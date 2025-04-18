<script setup lang="ts">
import Grid from "@/components/Grid.vue";
import {useCanvasStore} from "@/stores/canvas";
import { throttle } from "lodash-es";
import {computed, onMounted, ref, watch} from "vue";
import Context from "@/components/Context.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import SelectArea from "@/components/SelectArea.vue";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {getCursorPosition, getDataTransformMaterial} from "@/componsables/utils/CanvasUtil";
import {createCSSAttributes, updateMaterialCSSAttribute} from "@/renren-engine/renderer/renderer";
import {$message} from "@/componsables/element-plus";
import DisplayItem from "@/components/DisplayItem.vue";
import {MAX_CANVAS_WIDTH} from "@/componsables/constants/CanvasConstant";
import {useSchemaStore} from "@/stores/schema";
import {DEFAULT_CONTEXT_MENU_LIST} from "@/componsables/constants/WorkerSpaceConstant";
import {$engine} from "@/renren-engine/engine";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";



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
const schemaStore = useSchemaStore();
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
// 邮件菜单列表
const contextMenuList = ref<RenrenInterface.KeyValueIndexType<Function, string>[]>(DEFAULT_CONTEXT_MENU_LIST);


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
  event?.preventDefault();
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
    event.preventDefault();
    const currentX = event.clientX;
    const currentY = event.clientY;
    const editorRect = editor.value?.getBoundingClientRect();

    // 计算选区的宽度和高度
    requestAnimationFrame(() => {
      areaWidth.value = Math.abs(currentX - startX);
      areaHeight.value = Math.abs(currentY - startY);

      // 计算选区的起始位置
      selectAreaStart.value.x = Math.min(currentX, startX) - editorRect?.x;
      selectAreaStart.value.y = Math.min(currentY, startY) - editorRect?.y;
    });
  }
}



function resetData() {
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
const throttleDragEventHandler = throttle(
  async function handleDragEvent<T extends RenrenMaterialModel>(e: DragEvent) {
    // console.log('组件拖入');
    // 接受物料
    if (e) {
      e?.preventDefault();
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
        // 更新新增物料标识
        canvasStore.isAdd = generateUUID();
        requestAnimationFrame(async () => {
          const left: RenrenInterface.KeyValueIndexType<string, string> = {
            key: 'style',
            value: `${position.x}`,
            index: 'left'
          };
          const top: RenrenInterface.KeyValueIndexType<string, string> = {
            key: 'style',
            value: `${position.y}`,
            index: 'top'
          }
          const positions: RenrenInterface.KeyValueIndexType<string, string> = {
            key: 'style',
            value: 'absolute',
            index: 'position'
          };
          // 注册物料到 materialContainer & schema
          material = await createCSSAttributes(material, [left, top, positions]);
          materialContainer.value.push(material);
          // 防止误触导致插入空值
          const isEmpty: boolean = Object.keys(material).length === 0 && material.constructor === Object;
          // 保存 schema
          if (!isEmpty) {
            await $engine.insertNode2Document(material).catch(err => {
              $message({
                type: 'warning',
                message: err
              });
            });
          }
        });
      }
    }
  },
  16
);


/**
 * @description 处理物料拖拽事件
 * @param item
 * @param event
 */
const throttledMaterialMousemoveHandler = throttle(
  async function materialMousemoveHandler<T extends RenrenMaterialModel>(item: T, event?: DragEvent) {
    event?.preventDefault();
    event?.stopPropagation();

    // 获取物料拖动位置
    let position = { x: 0, y: 0 };
    if (editor.value) {
      position = await getCursorPosition(event, editor.value, 500);
    }

    // 使用 requestAnimationFrame 更新样式
    requestAnimationFrame(async () => {
      const left: RenrenInterface.KeyValueIndexType<string, string> = {
        key: 'style',
        value: `${position.x}`,
        index: 'left',
      };
      const top: RenrenInterface.KeyValueIndexType<string, string> = {
        key: 'style',
        value: `${position.y}`,
        index: 'top'
      };
      const positions: RenrenInterface.KeyValueIndexType<string, string> = {
        key:'style',
        value: 'absolute',
        index: 'position'
      };

      // 更新 schema
      const node = await updateMaterialCSSAttribute(item.id, [left, top, positions]).catch(err => {
        $message({
          type: 'warning',
          message: err,
        });
      });

      if (node) {
        materialContainer.value = materialContainer.value.map(material => {
          return material.id === node.id ? node : material;
        });
        // 同步到 schemaStore 中
        schemaStore.currentElement = node;
      }
    });
  },
  16 // 节流时间设为16ms，与浏览器帧率（60fps）同步
);/** ===== 画布拖拽业务-end ===== **/
/**
 * @description 保持物料容器数据持久化
 */
async function keepMaterialAlive() {
  const nodes: RenrenMaterialModel[] | void = await $engine.getPersistNodeList().catch((err: string) => {
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
 * @description 处理网格背景点击事件
 * 1. 如果点击背景，就将当前元素设为背景置空
 * @param event
 */
async function gridClickHandler(event: MouseEvent) {
  event.stopPropagation();
  // console.log('click grid');
  schemaStore.currentElement = await $engine.getSchema() as MaterialDocumentModel;
}


/**
 * @description 处理 grid 外部点击事件
 * @param e
 */
async function outerGridClickHandler(e: MouseEvent) {
  e.stopPropagation();
  schemaStore.currentElement = undefined;
}


/**
 * @description 处理组件点击选中事件
 * @param item
 * @param e
 */
function selectCurrentElement(item: RenrenMaterialModel, e?: MouseEvent) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  // 将[当前物料]元素设为当前点击选中的物料
  schemaStore.currentElement = item as RenrenMaterialModel;
}


/**
 * @description 粘贴物料
 */
function pasteMaterial() {
  // 检查 currentElement 的类型，只有是 RenrenMaterialModel 类型支持粘贴操作
  if (schemaStore.currentElement !== void 0) {
    if (schemaStore.currentElement?.type === 'material') {
      $message({
        type: 'info',
        message: `粘贴组件: ${schemaStore.currentElement?.title}`,
      });
    } else {
      $message({
        type: 'warning',
        message: '请先选择要粘贴的组件'
      });
    }
  }
}


/**
 * @description 初始化右键菜单列表
 * 1. 如果当前选中的元素不存在，则使用默认菜单列表初始化
 * 2. 如果当前选中的元素存在，则使用物料专用的菜单列表初始化
 * @returns {Promise<string>}
 */
function initContextMenuItem(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      // 如果不存在当前选中的元素则使用默认菜单列表初始化
      if (schemaStore.currentElement !== void 0) {
        if (schemaStore.currentElement?.type === 'material') {
          contextMenuList.value = [
            {
              key: '复制',
              value: () => {
                $message({
                  type: 'info',
                  message: '复制成功'
                });
                isShow.value = false;
              },
              index: 'copy'
            },
            {
              key: '粘贴',
              value: pasteMaterial,
              index: 'paste'
            },
            {
              key: '剪切',
              value: () => {},
              index: 'cut'
            },
            {
              key: '删除',
              value: () => {},
              index: 'delete'
            },
            {
              key: '锁定',
              value: () => {},
              index: 'lock'
            },
            {
              key: '上移',
              value: () => {},
              index: 'up'
            },
            {
              key: '下移',
              value: () => {},
              index: 'down'
            }
          ];
        }
      } else {
        contextMenuList.value = DEFAULT_CONTEXT_MENU_LIST;
      }
      resolve('初始化右键菜单列表成功');
    } catch (e) {
      console.log('初始化右键菜单列表失败', e);
      reject('初始化右键菜单列表失败');
    }
  });
}


/**
 * @description
 * @param e
 */
function displayItemDragendHandler(e: DragEvent) {
  e?.preventDefault();
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

/**
 * @description 初始化右键菜单列表
 */
watch(() => schemaStore.currentElement, () => {
  initContextMenuItem().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
})
</script>

<template>
  <div @click="outerGridClickHandler" class="w-full h-full flex flex-col p-4">
    <el-scrollbar height="628">
      <div
        ref="editor"
        @click.right="canvasRightClickHandler"
        @dragover="handleDragover"
        @drop="throttleDragEventHandler($event)"
        draggable="false"
        :style="`height: ${canvasStore.height}px;width: ${MAX_CANVAS_WIDTH}px;`"
        class="w-full flex items-center justify-center relative"
      >
        <!-- 网格线 -->
        <Grid
          @mousedown.left="mousedownHandler"
          :height="canvasSize.height"
          :width="canvasSize.width"
          :back-color="canvasStore.canvasColor"
          @click="gridClickHandler"
        />
        <!-- 右键单选框 -->
        <Context
          v-model:show="isShow"
          :menu-list="contextMenuList"
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
          @click="selectCurrentElement(item, $event);"
          :key="index"
          :item="item"
          @dragover="displayItemDragendHandler"
          @move="throttledMaterialMousemoveHandler(item, $event)"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
