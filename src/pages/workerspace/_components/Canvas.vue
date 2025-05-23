<script setup lang="ts">
import Grid from "@/components/Grid.vue";
import {myCanvasStore} from "@/stores/canvas";
import {debounce, throttle} from "lodash-es";
import {computed, nextTick, onMounted, reactive, ref, watch} from "vue";
import Context from "@/components/Context.vue";
import SelectArea from "@/components/SelectArea.vue";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$message} from "@/componsables/element-plus";
import DisplayItem from "@/components/DisplayItem.vue";
import {mySchemaStore} from "@/stores/schema";
import {DEFAULT_CONTEXT_MENU_LIST, NEW_ELEMENT} from "@/componsables/constants/WorkerSpaceConstant";
import {$engine} from "@/renren-engine/engine";
import $event from "@/componsables/utils/EventBusUtil";
import {$util} from "@/componsables/utils";
import {LocalforageDB} from "@/componsables/database/LocalforageDB";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import positionTemplate from './material-position-template.json';


withDefaults(defineProps<{
  clearFlag?: boolean; // 清空画布标识
}>(), {
  clearFlag: false
});





const editor = ref();
const emits = defineEmits(['paste']);
const cursorX = ref<number>(0);
const cursorY = ref<number>(0);
const isShow = ref<boolean>(false);
const isShowArea = ref<boolean>(false);
const areaWidth = ref<number>(0);
const areaHeight = ref<number>(0);
const canvasSize = computed(() => {
  return {
    width: `${myCanvasStore.width}px`,
    height: `${myCanvasStore.height}px`,
  }
});
type positionType = {
  left: RenrenInterface.KeyValueIndexType<string, string>;
  top: RenrenInterface.KeyValueIndexType<string, string>;
  positions: RenrenInterface.KeyValueIndexType<string, string>;
};
const materialContainer = ref<RenrenMaterialModel[]>([]);
const selectAreaStart = ref<RenrenInterface.XAndYType<number, number>>({
  x: 0,
  y: 0
});
const materialZIndex = reactive<RenrenInterface.KeyValueIndexType<string, string>>({
  index: "z-index",
  key: "style",
  value: ""
});
const materialPosition = reactive<positionType>(
  $util.renren.jsonTypeTransfer<positionType>(positionTemplate)
);
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
    // 接受物料
    if (e) {
      e?.preventDefault();
      // 获取位置信息
      let material: T = $util.canvas.getDataTransformMaterial(e) as T;
      if (!$util.renren.isEmpty(material)) {
        // 设置 props
        let position = {
          x: 0,
          y: 0
        };
        if (editor.value) {
          position = await $util.canvas.getCursorPosition(e, editor.value, 300);
        }
        // 更新新增物料标识
        requestAnimationFrame(async () => {
          materialPosition.left.value = `${position.x}`;
          materialPosition.top.value = `${position.y}`;
          const indexedDB = new LocalforageDB();
          // 注册物料到 materialContainer & schema
          material = await $engine.renderer.createCSSAttributes(
            material,
            [
              materialPosition.left,
              materialPosition.top,
              materialPosition.positions
            ]);
          // 生成 唯一标识
          material.id = $util.nano.generateUUID();
          materialContainer.value.push(material);
          // 将新增物料暂存到 store
          mySchemaStore.newElement = material as RenrenMaterialModel;
          // 防止误触导致插入空值
          // 保存 schema
          await saveSchema(material);
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

    if (!item.isLocked) {
      // 获取物料拖动位置
      let position = { x: 0, y: 0 };
      if (editor.value) {
        position = await $util.canvas.getCursorPosition(event, editor.value, 500);
      }
      // 使用 requestAnimationFrame 更新样式
      requestAnimationFrame(async () => {
        materialPosition.left.value = `${position.x}`;
        materialPosition.top.value = `${position.y}`;

        // 更新 schema
        const node = await $engine.renderer.updateMaterialCSSAttribute(item.id,
          [
            materialPosition.left,
            materialPosition.top,
            materialPosition.positions
          ]).catch(err => {
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
          mySchemaStore.currentElement = node;
        }
      });
    }
    // 通知 物料编辑框 进行更新
    $event.emit('updateShape');
  },
  16 // 节流时间设为16ms，与浏览器帧率（60fps）同步
);


/** ===== 画布拖拽业务-end ===== **/
/**
 * @description 保持物料容器数据持久化
 */
async function keepMaterialAlive() {
  const nodes: RenrenMaterialModel[] | void = await $engine.arrangement.getPersistNodeList().catch((err: string) => {
    $message({
      type: 'warning',
      message: err
    });
  });
  if (Array.isArray(nodes) && nodes.length > 0) {
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
  mySchemaStore.currentElement = await $engine.arrangement.getSchema() as MaterialDocumentModel;
}


/**
 * @description 处理 grid 外部点击事件
 * @param e
 */
async function outerGridClickHandler(e: MouseEvent) {
  e.stopPropagation();
  mySchemaStore.currentElement = undefined;
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
  mySchemaStore.currentElement = undefined;
  if (item !== void 0) {
    mySchemaStore.currentElement = item as RenrenMaterialModel;
  }
}


async function saveSchema(item: RenrenMaterialModel | undefined) {
  if (item !== void 0) {
    const indexedDB = new LocalforageDB();
    await $engine.arrangement.insertNode2Document(item).then(() => {
      // 使用 eventBus 触发插入事件
      $event.emit('insert');
      indexedDB.insert(NEW_ELEMENT, item);
      $event.emit(`pushMaterial:${item.id}`);
    }).catch(err => {
      $message({
        type: 'warning',
        message: err
      });
    });
  }
}


/**
 * @description 粘贴物料
 */
async function pasteMaterial() {
  // 检查 currentElement 的类型，只有是 RenrenMaterialModel 类型支持粘贴操作
  if ($util.renren.isMaterial(mySchemaStore.copyMaterial)) {
    if (mySchemaStore.copyMaterial !== void 0) {
      let newMaterial: RenrenMaterialModel = $util.renren.deepClone(mySchemaStore.copyMaterial) as RenrenMaterialModel;
      // 重新生成新的 id
      newMaterial.id = $util.nano.generateUUID();
      materialContainer.value.push(newMaterial);
      await saveSchema(newMaterial);
    }
  } else {
    $message({
      type: 'warning',
      message: '请先复制要粘贴的组件'
    });
  }
}

/**
 *  物料层级控制 -start
 */


/**
 * @description 递增增加选中物料的层级
 */
function stepZIndexUp(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
        const material = mySchemaStore.currentElement as RenrenMaterialModel;
        if (!$util.renren.isEmpty(material)) {
          if (material.props && material.props.items) {
            if (material.props.items?.length > 0) {
              let zIndex: number | undefined = getMaterialIndexNumber(material?.props?.items);
              // 先判断 z-index 是否达到 99,如果是则显示到达最顶层
              if (zIndex !== void 0) {
                if (++ zIndex >= 99) {
                  reject('到顶了');
                } else {
                  // 将当前物料的 z-index ++
                  ++ zIndex;
                  material.props.items.find(item => item.type === 'z-index')!.value = zIndex.toString();
                  // 同步到 store
                  mySchemaStore.currentElement = material;
                  // 组装 css
                  materialZIndex.value = zIndex.toString();
                  // 同步到 schema
                  $engine.renderer.updateMaterialCSSAttribute(material.id, materialZIndex).catch(err => {
                    console.error(err);
                    reject(err);
                  });
                  resolve('变更成功');
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('提升物料层级失败', e);
    }
  });
}


/**
 * @description 获取物料属性节点中的 z-index 信息
 * @param items
 */
function getMaterialIndexNumber(items: MaterialInterface.IProp[] | undefined): number | undefined {
  if (Array.isArray(items) && items.length !== 0) {
    return Number(items?.find(item => item.type === 'z-index')?.value);
  }
}


/**
 * @description 步进递减选中组件的层级
 */
function stepZIndexDown(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
        const material = mySchemaStore.currentElement as RenrenMaterialModel;
        if (!$util.renren.isEmpty(material)) {
          if (Array.isArray(material?.props?.items) && material?.props?.items.length !== 0) {
            let zIndex: number | undefined = getMaterialIndexNumber(material?.props?.items);
            // 先判断 z-index 是否达到 1,如果是则显示到达最底层
            if (zIndex !== void 0) {
              if (-- zIndex === 0) {
                reject('到底了');
              } else {
                // 否则将当前物料的 z-index --
                zIndex --;
                material.props.items.find(item => item.type === 'z-index')!.value = zIndex.toString();
                // 同步到 store
                mySchemaStore.currentElement = material;
                // 组装 css
                materialZIndex.value = zIndex.toString();
                // 同步到 schema
                $engine.renderer.updateMaterialCSSAttribute(material.id, materialZIndex).catch(err => {
                  console.error(err);
                  reject(err);
                });
                resolve('变更成功');
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('提升物料层级失败', e);
    }
  });
}


/**
 * @description 修改层级
 */
function changeZIndex(flag: string = 'up') {
  if (flag === 'up') {
    stepZIndexUp().catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
    isShow.value = false;
    $event.emit(`updateMaterial:${(mySchemaStore.currentElement as RenrenMaterialModel)?.id}`);
  } else if (flag === 'down') {
    stepZIndexDown().catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
    isShow.value = false;
    $event.emit(`updateMaterial:${(mySchemaStore.currentElement as RenrenMaterialModel)?.id}`);
  } else {
    $message({
      type: 'warning',
      message: '非法参数'
    });
  }
}

/**
 *  物料层级控制 -end
 */


/**
 * @description 删除当前选中的物料
 */
function deleteCurrentMaterial(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
        // 暂存 currentElement
        const material = mySchemaStore.currentElement as RenrenMaterialModel;
        // 清空 schemaStore 中的 currentElement
        mySchemaStore.currentElement = undefined;
        // 删除 schema 中对应的 material node
        $engine.arrangement.deleteNode(material.id).catch(err => {
          console.error('删除物料失败',err);
          reject('删除物料失败');
        });
        // 更新 materialContainer
        materialContainer.value = materialContainer.value.filter(item => item.id !== material.id);
        resolve('删除物料成功');
      }
    } catch (e) {
      console.error('删除物料失败', e);
      reject('删除物料失败');
    }
  });
}


/**
 * @description 删除物料节点
 */
function deleteNode() {
  deleteCurrentMaterial().then(() => {
    $message({
      type: 'info',
      message: '删除成功'
    });
    isShow.value = false;
  }).catch(err => {
    $message({
      type: 'warning',
      message: err
    });
    isShow.value = false;
  });
}


/**
 * @description 处理复制组件事件
 */
function copyMaterialHandler() {
  if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
    mySchemaStore.copyMaterial = mySchemaStore.currentElement as RenrenMaterialModel;
  }
  isShow.value = false;
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
      if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
        contextMenuList.value = [
          {
            key: '复制',
            value: copyMaterialHandler,
            index: 'copy'
          },
          {
            key: '粘贴',
            value: pasteMaterial,
            index: 'paste'
          },
          {
            key: '删除',
            value: deleteNode,
            index: 'delete'
          },
          {
            key: '锁定',
            value: () => $event.emit('lock'),
            index: 'lock'
          },
          {
            key: '解锁',
            value: () => $event.emit('unlock'),
            index: 'unLock'
          },
          {
            key: '上移',
            value: () => changeZIndex('up'),
            index: 'up'
          },
          {
            key: '下移',
            value: () => changeZIndex('down'),
            index: 'down'
          }
        ];
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
 * @description 更新物料数据
 */
function updateMaterialData(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      materialContainer.value = materialContainer.value.map(material => {
        if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
          if (material.id === (mySchemaStore.currentElement as RenrenMaterialModel)?.id) {
            return mySchemaStore.currentElement as RenrenMaterialModel;
          } else {
            return material;
          }
        } else {
          return material;
        }
      });
      // 等待 DOM 更新完成
      nextTick(() => {
        resolve('更新物料数据成功');
      });
    } catch (e) {
      console.error('更新物料数据失败', e);
      reject('更新物料数据失败');
    }
  });
}


/**
 * @description 初始化网格背景颜色
 */
function checkGridBackgroundColor(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const document: MaterialDocumentModel | undefined = await $engine.arrangement.getSchema();
      if (document !== void 0) {
        if (!$util.renren.isEmpty(document)) {
          if (document.prop && document.prop.items) {
            if (document.prop.items.length > 0) {
              myCanvasStore.canvasColor = document.prop.items.find(item => item.type === 'background-color')?.value;
              resolve('检查网格背景颜色成功');
            }
          }
        }
      }
    } catch (e) {
      console.error('检查网格背景颜色失败', e);
      reject('检查网格背景颜色失败');
    }
  });
}


/**
 * @description 撤销事件
 */
function resetEventHandler(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const material = mySchemaStore.elementInProcess as RenrenMaterialModel;
      // 如果触发撤销操作，就从当前容器内删除对应的元素
      if (material !== void 0) {
        materialContainer.value = materialContainer.value.filter(item => item.id !== material?.id);
        nextTick(() => {
          resolve('撤销成功');
        });
      }
    } catch (e) {
      console.error('撤销失败', e);
      reject('撤销失败');
    }
  });
}


/**
 * @description 处理反做事件
 */
function revertEventHandler(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const debounceRevert = debounce(() => {
        const material = mySchemaStore.elementInProcess as RenrenMaterialModel;
        if (material !== void 0) {
          materialContainer.value.push(material);
          nextTick(() => {
            resolve('反做成功');
          });
        }
      }, 100);
      debounceRevert();
    } catch (e) {
      console.error('反做失败', e);
      reject('反做失败');
    }
  });
}

/**
 * @description 清空画布
 */
$event.on('clearCanvas', () => {
  materialContainer.value = [];
  mySchemaStore.newElement = undefined;
});


/**
 * @description 处理画布截图事件
 */
$event.on('takePhoto', async () => {
  const url: string | void = await $util.renren.takeScreenPhoto(editor.value).catch(err => {
    console.error('截图失败', err);
  });
  if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas.png';
    link.click();
  }
});



/**
 * @description 处理撤销操作
 */
watch(() => mySchemaStore.elementInProcess, (newVal, oldVal) => {

    // 移除旧的监听器
    if (oldVal && oldVal.id) {
      $event.off(`revert:${oldVal.id}`);
    }

    /**
     * @description 撤销操作
     */
  $event.on(`reset:${newVal?.id}`, () => {
    resetEventHandler().then(() => {
      $message({
        type: 'info',
        message: '撤销操作'
      });
    }).catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
  });



    /**
     * @description 反做事件
     */
    $event.on(`revert:${newVal?.id}`, () => {
      revertEventHandler().then(res => {
        $message({
          type: 'info',
          message: res as string
        });
      }).catch(err => {
        $message({
          type: 'warning',
          message: err as string
        });
      });
    });
},
  {
    deep: true
});

/**
 * @description 页面挂载时，保持物料容器数据持久化
 */
onMounted(async () => {
  await keepMaterialAlive();
  await checkGridBackgroundColor().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
});

/**
 * @description 初始化右键菜单列表
 */
watch(() => mySchemaStore.currentElement, () => {
  // 初始化右键菜单
  initContextMenuItem().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
  // 更新 materialContainer 数据
  updateMaterialData().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
}, {
  deep: true
})



$event.on('updateMaterial', () => {
  updateMaterialData().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
});


$event.on('clearContext', () => {
  isShow.value = false;
});
</script>

<template>
  <div
    @click="outerGridClickHandler"
    class="w-full h-full flex flex-col p-4"
  >
    <el-scrollbar height="628">
      <div
        ref="editor"
        @click.right="canvasRightClickHandler"
        @dragover="handleDragover"
        @drop="throttleDragEventHandler($event)"
        draggable="false"
        :style="`height: ${myCanvasStore.height}px;width: ${myCanvasStore.width};`"
        class="flex items-center justify-center relative"
      >
        <!-- 网格线 -->
        <Grid
          @mousedown.left="mousedownHandler"
          :height="canvasSize.height"
          :width="canvasSize.width"
          :back-color="myCanvasStore.canvasColor"
          :opacity="myCanvasStore.opacity"
          :line-height="myCanvasStore.lineHeight"
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
          @dragend="displayItemDragendHandler"
          @move="throttledMaterialMousemoveHandler(item, $event)"
        />
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
  width: 100%;
}
</style>
