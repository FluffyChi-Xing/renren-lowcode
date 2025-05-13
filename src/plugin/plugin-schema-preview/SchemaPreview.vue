<script setup lang="ts">
import $event from "@/componsables/utils/EventBusUtil";
import {type Component, ref} from "vue";
import BaseDialog from "@/components/BaseDialog.vue";
import {$engine} from "@/renren-engine/engine";
import {$message} from "@/componsables/element-plus";
const previewFlag = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const pageElement = ref<Component[]>([]);



// TODO 需要将画布尺寸的数据维护从 pinia 重构到 indexedDB 中
// TODO: 防止因为错误的挂载时机，导致插件子啊注册的时候报错
$event.on('previewPage', () => {
  previewFlag.value = true;
  isLoading.value = true;
  $engine.renderer.previewRenderingPage().then((res: Component[]) => {
    pageElement.value = res;
    // TODO: 绑定动画
    // TODO: 绑定事件
    isLoading.value = false;
  }).catch(() => {
    isLoading.value = false;
    $message({
      type: 'warning',
      message: '预览失败,请稍后'
    });
  });
  isLoading.value = false;
});


/**
 * @description 处理画布清空事件
 */
$event.on('clearCanvas', () => {
  pageElement.value = [];
});
</script>

<template>
  <div>
    <el-button @click="() => $event.emit('previewPage')" type="primary">预览</el-button>
    <!-- preview-whole-page -->
    <BaseDialog
      v-model:show="previewFlag"
      title="预览页面"
      :width="1080"
      :footer="true"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <template #default>
        <div
          v-loading="isLoading"
          class="w-full h-auto flex"
          :style="{ height: '1080px', backgroundColor: '#000' }"
        >
          <component
            v-for="(item, index) in pageElement"
            :key="index"
            :is="item"
          />
        </div>
      </template>
      <template #footer>
        <div class="w-full h-auto flex items-center justify-end">
          <el-button @click="() => previewFlag = false" type="info">关闭</el-button>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<style scoped>

</style>
