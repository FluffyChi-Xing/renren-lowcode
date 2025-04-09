<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string;
  name?: string;
  index?: string;
}>(), {
  icon: 'Menu',
  name: '未命名',
  index: '1'
});
</script>

<template>
  <div
    class="w-full h-8 grid text-black cursor-pointer grid-cols-2 gap-2 items-center px-4 mb-1 hover:bg-blue-200 hover:text-blue-500"
  >
    <div class="w-full h-full flex items-center">
      <!-- icon -->
      <el-icon class="mr-2">
        <component :is="icon"/>
      </el-icon>
      <!-- name -->
      <span>{{ name }}</span>
    </div>
    <!-- functional banner -->
  </div>
</template>

<style scoped>

</style>
