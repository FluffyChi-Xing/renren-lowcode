<script setup lang="ts">

import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";

withDefaults(defineProps<{
  item?: RenrenMaterialModel | undefined;
}>(), {
  item: undefined
});
</script>

<template>
  <div
    v-bind="item"
    class="w-full h-[100px] item flex cursor-pointer flex-col p-4 rounded-[3px] hover:shadow-md"
  >
    <!-- icon -->
    <div class="w-full h-auto flex items-center justify-center">
      <el-icon size="30">
        <component :is="item?.icon" />
      </el-icon>
    </div>
    <!-- label -->
    <p class="items-center w-full h-auto mt-auto text-center">{{ item.title ? item.title : '未知物料' }}</p>
  </div>
</template>


<style scoped>
.item {
  border: 1px solid #e4e7ec;
}
</style>
