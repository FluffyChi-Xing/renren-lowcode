<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {createMaterialElement} from "@/renren-engine/renderer/renderer";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";

const props = withDefaults(defineProps<{
  item?: RenrenMaterialModel | undefined;
}>(), {
  item: undefined
});
const emits = defineEmits(['create', 'move']);


const comp = ref();
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


onMounted(async () => {
  if (item.value) {
    // item.value.id = generateUUID(); // 重新生成组件的主键，防止组件复用时出现主键重复的问题
    comp.value = await createMaterialElement(props.item as RenrenMaterialModel);
  }
})


watch(() => props.item, async (newValue) => {
  if (newValue) {
    item.value = newValue;
    // item.value.id = generateUUID(); // 重新生成组件的主键，防止组件复用时出现主键重复的问题
    comp.value = await createMaterialElement(props.item as RenrenMaterialModel);
  } else {
    comp.value = undefined;
  }
});
</script>

<template>
  <component
    :is="comp"
    draggable="true"
    @dragend="materialMoveHandler($event)"
    @dragover="dragoverHandler($event)"
  />
</template>

<style scoped>

</style>
