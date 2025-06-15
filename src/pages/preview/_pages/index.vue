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

<script setup lang="ts">
import {type Component, ref, reactive, onMounted} from 'vue';
import {$message} from "@/componsables/element-plus";
import '@/assets/animation.css';
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";
import {useRoute} from "vue-router";



const route = useRoute();
/** ========= 预览页初始化-start ========= **/
const engineInstance = container.resolve<IEngine>('engine');
const canvasConfiguration = reactive<CanvasInterface.canvasConfig>({
  config: {}
});
const pageComponents = ref<Component[]>([]);


/**
 * @description 初始化画布
 * @param key
 */
async function initCanvas(key?: string) {
  await engineInstance.renderer.getDocumentProps(key)
    .then(res => {
      canvasConfiguration.config = res?.config;
      console.log(res, key);
    });
}


async function pagePreviewRender() {
  await engineInstance.renderer.previewPage(route.params?.index as string)
    .then(res => {
      pageComponents.value = res as Component[];
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
  console.log('on mounted')
  await initCanvas(route.params?.index as string);
  await pagePreviewRender();
});
</script>
