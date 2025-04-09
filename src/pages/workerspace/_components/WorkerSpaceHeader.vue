<script setup lang="ts">
import { useRouter } from "vue-router";
import {ref } from 'vue';
import TheHeader from "@/components/TheHeader.vue";
import CanvasSizeConfiguration from "@/pages/workerspace/_components/header/CanvasSizeConfiguration.vue";
import ProjectFunctionalBanner from "@/pages/workerspace/_components/header/ProjectFunctionalBanner.vue";


const router = useRouter();
const canvasSize = ref<number>(0);
// TODO: 当画布尺寸变动的时候，将数据同步到 schema 的 MaterialDocumentModel 的 props 中

/**
 * @description 刷新页面
 */
function refreshPage() {
  router.push('/workerspace');
}


/**
 * @description 处理画布尺寸变化事件
 * @param index
 */
function canvasSizeChangeHandler(index: number) {
  if (index) {
    // 保存尺寸变化后的 canvas width
    canvasSize.value = index;
    // TODO: 调用 engine 的 insertCSSAttributes API 将 canvasSize.value 赋值到 props 中
  }
}
</script>

<template>
  <TheHeader>
    <template #left>
      <div class="w-full h-full pl-10 text-gray-50 flex items-center">
        <!-- TODO: logo -->
        <span @click="refreshPage" class="w-auto h-auto flex text-[1.2rem] cursor-pointer font-bold">人人低码</span>
      </div>
    </template>
    <template #middle>
      <CanvasSizeConfiguration @update:size="canvasSizeChangeHandler" />
    </template>
    <template #right>
      <ProjectFunctionalBanner />
    </template>
  </TheHeader>
</template>

<style scoped>

</style>
