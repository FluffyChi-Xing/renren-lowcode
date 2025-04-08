<script setup lang="ts">
import { ref } from 'vue';
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import Draggable from "@/components/Draggable.vue";
import {buttonSchema} from "@/material/base/Button";
import MaterialItem from "@/components/MaterialItem.vue";

const baseMaterialList = ref<RenrenMaterialModel[]>([new RenrenMaterialModel(buttonSchema)]);


/**
 * @description 处理开始拖拽事件
 * @param index
 */
function startHandler(index: any): Promise<any> {
  return new Promise<any>((resolve) => {
    resolve(index);
  });
}


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
  <Draggable
    v-model:model-value="baseMaterialList"
    :group="{ name: 'simulator', pull: 'clone', put: false }"
    :animation="150"
    class="w-full h-full"
    @start="startHandler"
  >
    <div class="w-full h-full grid grid-cols-2 gap-1">
      <MaterialItem
        v-for="item in baseMaterialList"
        :key="item.id"
        :item="item"
        @start="startDrag($event, item)"
      />
    </div>
  </Draggable>
</template>

<style scoped>

</style>
