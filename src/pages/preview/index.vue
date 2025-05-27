<script setup lang="ts">
import {type Component, ref, reactive, onMounted} from 'vue';
import {$engine} from "@/renren-engine/engine";
import {$message} from "@/componsables/element-plus";
import '@/assets/animation.css';
import CoreEngine from "@/renren-engine";


/** ========= 预览页初始化-start ========= **/
const engineInstance = new CoreEngine();
const canvasConfiguration = reactive<CanvasInterface.canvasConfig>({
  config: {}
});
const pageComponents = ref<Component[]>([]);


/**
 * @description 初始化画布
 * @param key
 */
async function initCanvas(key?: string) {
  await $engine.renderer.getSchemaConfiguration(key)
    .then(res => {
      canvasConfiguration.config = res?.config;
    });
}


async function pagePreviewRender() {
  await engineInstance.renderer.previewPage()
    .then(res => {
      pageComponents.value = res as Component[];
      console.log(res);
    })
    .catch(_ => {
      $message({
        type: 'warning',
        message: '预览失败'
      });
    });
}

/** =========== 预览页初始化-end ========= **/



onMounted(async () => {
  await initCanvas();
  await pagePreviewRender();
});
</script>

<template>
  <div
    :style="{
      ...canvasConfiguration.config
    }"
    class="w-full h-full flex flex-col"
  >
    <component
      v-for="(item, index) in pageComponents"
      :key="index"
      :is="item"
    />
  </div>
</template>

<style scoped>

</style>
