<script setup lang="ts">

import Shape from "@/components/Shape.vue";
</script>

<template>
  <div class="w-full h-full flex flex-col bg-black relative">
    <Shape class="absolute top-1/2 left-1/2">
      <el-button type="primary" plain>按钮</el-button>
    </Shape>
  </div>
</template>

<style scoped>

</style>
