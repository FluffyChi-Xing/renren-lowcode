<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import { nextTick } from "vue";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import '@/assets/animation.css';
import {$message} from "@/componsables/element-plus";
import $event from "@/componsables/utils/EventBusUtil";
import {animationNameValueMap} from "@/componsables/utils/AnimationUtil";
import {useSchemaStore} from "@/stores/schema";
import {$engine} from "@/renren-engine/engine";

const props = withDefaults(defineProps<{
  item?: RenrenMaterialModel | undefined;
}>(), {
  item: undefined
});
const emits = defineEmits(['create', 'move']);


const comp = ref();
const materialNode = ref();
const schemaStore = useSchemaStore();
const item = ref<RenrenMaterialModel>(props.item as RenrenMaterialModel);


/**
 * @description 处理组件拖动事件
 * @param e
 */
async function materialMoveHandler(e: DragEvent) {
  e.preventDefault();
  if (e) {
    emits('move', e);
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
      comp.value = await $engine.renderer.createMaterialElement(props.item as RenrenMaterialModel).catch(err => {
        $message({
          type: 'warning',
          message: err as string
        });
      });
      // console.log(props.item);
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
        if (schemaStore.currentElement !== void 0 && schemaStore.currentElement?.type === 'material') {
          const material: RenrenMaterialModel = schemaStore.currentElement as RenrenMaterialModel;
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
                // console.log(domElement.classList);
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


onMounted(async () => {
  if (item.value) {
    comp.value = await $engine.renderer.createMaterialElement(props.item as RenrenMaterialModel);
  }
})


watch(() => props.item, async (newValue) => {
  if (newValue) {
    item.value = newValue;
    comp.value = await $engine.renderer.createMaterialElement(props.item as RenrenMaterialModel);
  } else {
    comp.value = undefined;
  }
});


/**
 * @description 处理组件更新事件
 */
$event.on(`updateMaterial:${props.item?.id}`, () => {
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
    @dragend="materialMoveHandler($event)"
    @dragover="dragoverHandler($event)"
  />
</template>

<style scoped>

</style>
