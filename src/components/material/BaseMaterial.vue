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
</script>

<template>
  <Draggable
    v-model:model-value="baseMaterialList"
    group="base-material"
    ghost-class="ghost"
    :animation="150"
    class="w-full h-full"
    @start="startHandler"
  >
    <div class="w-full h-full grid grid-cols-2 gap-1">
      <MaterialItem
        v-for="item in baseMaterialList"
        :key="item.id"
        :item="item"
      />
    </div>
  </Draggable>
</template>

<style scoped>

</style>
