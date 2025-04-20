<script setup lang="ts">
import $event from "@/componsables/utils/EventBusUtil";
import {useSchemaStore} from "@/stores/schema";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {MaterialDocumentModel} from "@/componsables/models/MaterialModel";




const schemaStore = useSchemaStore();


/**
 * @description 添加动画事件
 */
function addAnimation2MaterialHandler() {
  const material: RenrenMaterialModel | MaterialDocumentModel | undefined = schemaStore.currentElement;
  if (material !== void 0) {
    if (material.type === 'material') {
      $event.emit(`addAnimation:${(material as RenrenMaterialModel)?.id}`);
    }
  }
}
</script>

<template>
  <div class="w-full h-auto items-center justify-center flex">
    <el-button @click="addAnimation2MaterialHandler">添加动画</el-button>
    <el-button>预览动画</el-button>
  </div>
</template>

<style scoped>

</style>
