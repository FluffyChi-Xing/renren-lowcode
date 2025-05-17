<script setup lang="ts">
import {PROJECT_ADDRESS} from "@/componsables/constants/RenrenConstant";


/**
 * @description 处理页面预览事件
 */
function previewPageHandler() {
  window.open(PROJECT_ADDRESS + '/preview', '_blank');
}
</script>

<template>
  <div>
    <el-button @click="previewPageHandler" type="primary">预览</el-button>
  </div>
</template>

<style scoped>

</style>
