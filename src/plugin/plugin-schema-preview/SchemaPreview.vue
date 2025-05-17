<script setup lang="ts">
import $event from "@/componsables/utils/EventBusUtil";
import {type Component, ref} from "vue";
import {PROJECT_ADDRESS} from "@/componsables/constants/RenrenConstant";
const pageElement = ref<Component[]>([]);


/**
 * @description 处理画布清空事件
 */
$event.on('clearCanvas', () => {
  pageElement.value = [];
});


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
