<script setup lang="ts">
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import Draggable from "@/components/Draggable.vue";
import MaterialItem from "@/components/MaterialItem.vue";



const props = withDefaults(defineProps<{
  index?: string;
  materialData?: RenrenMaterialModel[];
}>(), {
  materialData: () => [],
  index: '1', // 基础物料组件标识
});


/**
 * @description 处理拖拽开始事件
 * @param event
 * @param item
 */
function startDrag(event: DragEvent, item: RenrenMaterialModel) {
  event.dataTransfer?.setData('material', JSON.stringify(item));
}
</script>

<template>
  <div
    v-if="props.materialData.length > 0  && props.index === '1'"
  >
    <Draggable
      v-model:model-value="props.materialData"
      :group="{ name: 'simulator', pull: 'clone', put: false }"
      :animation="150"
      class="w-full h-full"
    >
      <div class="w-full h-full grid grid-cols-2 gap-1">
        <MaterialItem
          v-for="item in props.materialData"
          :key="item.id"
          :item="item"
          @start="startDrag($event, item)"
        />
      </div>
    </Draggable>
  </div>
  <el-empty
    v-else
    description="暂无物料元素"
  />
</template>

<style scoped>

</style>
