<script setup lang="ts">
import {ref, watch} from 'vue';
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import Draggable from "@/components/Draggable.vue";
import {buttonSchema} from "@/material/base/Button";
import MaterialItem from "@/components/MaterialItem.vue";
import {textSchema} from "@/material/base/Text";
import {linkSchema} from "@/material/base/Link";
import {imageSchema} from "@/material/base/Image";



const props = withDefaults(defineProps<{
  index?: string;
  materialData?: RenrenMaterialModel[] | undefined;
}>(), {
  materialData: () => [],
  index: '1', // 基础物料组件标识
});






const baseMaterialList = ref<RenrenMaterialModel[]>(props.materialData);


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



watch(() => props.index, () => {
  baseMaterialList.value = props.materialData;
});
</script>

<template>
  <div
    v-if="props.materialData.length > 0  && props.index === '1'"
  >
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
  </div>
  <el-empty
    v-else
    description="暂无物料元素"
  />
</template>

<style scoped>

</style>
