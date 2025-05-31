<script setup lang="ts">
import {onMounted, ref, watch, shallowRef} from 'vue';
import { nextTick } from "vue";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import '@/assets/animation.css';
import {$message} from "@/componsables/element-plus";
import $event from "@/componsables/utils/EventBusUtil";
import {animationNameValueMap} from "@/componsables/utils/AnimationUtil";
import {mySchemaStore} from "@/stores/schema";
import {$util} from "@/componsables/utils";
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";

const props = withDefaults(defineProps<{
  item?: RenrenMaterialModel | undefined;
}>(), {
  item: undefined
});
const emits = defineEmits(['create', 'move', 'copy', 'paste']);


const comp = shallowRef();
const materialNode = shallowRef();
// 创建引擎实例
const engineInstance = container.resolve<IEngine>('engine');
const item = ref<RenrenMaterialModel>(new RenrenMaterialModel(props.item));
const styleObj = ref<Record<string, string>>({
  position: 'absolute',
  left: '0px',
  top: '0px'
});
export type moveDataTransfer = {
  event: DragEvent;
  dom: HTMLElement;
};



/**
 * @description 处理组件拖动事件
 * @param e
 */
async function materialMoveHandler(e: DragEvent) {
  e.preventDefault();
  if (e) {
    if (materialNode.value !== void 0) {
      let config: moveDataTransfer = {
        event: e,
        dom: materialNode.value?.$el
      };
      emits('move', config);
    }
  }
}


/**
 * @description 处理拖动结束事件
 * @param e
 */
function dragoverHandler(e: DragEvent) {
  e.preventDefault();
}


/**
 * @description 处理组件更新事件
 */
function updateMaterialHandler(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      comp.value = undefined;
      comp.value = await engineInstance.renderer.createMaterialEl(props.item).catch(err => {
        $message({
          type: 'warning',
          message: err as string
        });
      });
      resolve('更新物料成功');
    } catch (e) {
      console.error('更新物料失败', e);
      reject('更新物料失败');
    }
  });
}


/**
 * @description 处理运行动画事件
 */
function runAnimationOnMaterial(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (materialNode.value !== void 0) {
        if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
          const material: RenrenMaterialModel = mySchemaStore.currentElement as RenrenMaterialModel;
          if (material.animation !== void 0) {
            // 获取 DOM 元素（处理组件实例的情况）
            const domElement = materialNode.value?.$el;
            domElement.classList.add(
              animationNameValueMap.get(material.animation[0].key) as string,
              'animated',
              'no-infinite'
            );

            const removeAnimation = () => {
              if (material.animation) {
                domElement.classList.remove(
                  animationNameValueMap.get(material.animation[0].key) as string,
                  'animated',
                  'no-infinite'
                );
                resolve('运行动画成功');
              }
            };
            domElement.addEventListener('animationend', removeAnimation);
            domElement.addEventListener('animationcancel', removeAnimation);
          }
        }
      }
    } catch (e) {
      console.error('运行动画失败', e);
      reject('运行动画失败');
    }
  });
}


/**
 * @description 预览动画
 */
async function previewAnimationHandler() {
  await nextTick();
  await runAnimationOnMaterial().catch(err => {
    $message({
      type: 'warning',
      message: err as string,
    });
  });
}


/**
 * @description 用于处理组件的位置同步
 * @warn 之前是通过重建组件进行位置同步，但是因为位置可能频繁的变化导致严重的性能问题，因此位置同步直接改为修改实例的style对应属性
 */
function syncPositionChange() {
  if (props.item && props.item.props?.items) {
    props.item.props.items.forEach(item => {
      if (item.key === 'style' && ['position', 'left', 'top'].includes(item.type)) {
        styleObj.value[item.type] = item.type === 'position' ? item.value : `${item.value}px`;
      }
    });
  }
}


/**
 * @description 处理复制事件
 */
function copyComponent(event: KeyboardEvent): void {
  if (materialNode.value) {
    if (!event) {
      return;
    }

    // 判断触发的是否为 ctrl + c
    let character: string = event.key.toLowerCase();
    if (character !== 'c') {
      return;
    }
    emits('copy', props.item);
  }
}


onMounted(async () => {
  if (item.value) {
    comp.value = await engineInstance.renderer.createMaterialEl(props.item as RenrenMaterialModel);
    // 初始化 styleObj
    syncPositionChange();
  }
})


watch(() => props.item, async (newValue) => {
  if (newValue) {
    await nextTick();
    setTimeout(() => {
      syncPositionChange();
    }, 0);
  } else {
    comp.value = undefined;
  }
});


/**
 * @description 处理组件更新事件
 */
$event.on(`updateMaterial:${props.item?.id}`, () => {
  syncPositionChange();
  updateMaterialHandler().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
});


/**
 * @description 处理预览动画事件
 */
$event.on(`previewAnimation:${props.item?.id}`, () => {
  previewAnimationHandler();
});
</script>

<template>
  <!-- 物料编辑框 -->
  <component
    :is="comp"
    draggable="true"
    ref="materialNode"
    class="cursor-move"
    :tabindex="0"
    :style="styleObj"
    @drag="materialMoveHandler($event)"
    @dragover="dragoverHandler($event)"
    @keydown.ctrl="copyComponent($event)"
  />
</template>

<style scoped>

</style>
