<script setup lang="ts">
import { ref } from 'vue';
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import DrawerTransition from "@/components/DrawerTransition.vue";
const isCollapse = ref<boolean>(false);
const collapseIcon = ref(ArrowRight);
const emits = defineEmits(['collapse']);


/**
 * @description 处理物料栏折叠事件
 */
function collapseBanner() {
  isCollapse.value = !isCollapse.value;
  emits('collapse', isCollapse.value);
  if (isCollapse.value) {
    collapseIcon.value = ArrowLeft;
  } else {
    collapseIcon.value = ArrowRight;
  }
}
</script>

<template>
  <div class="w-full h-full flex justify-end">
    <DrawerTransition>
      <div
        :style="isCollapse ? `width: calc(90% - 280px);` : `width: calc(90% - 60px);`"
        class="editor-aside flex shadow-sm flex-col bg-white relative p-4"
      >
        <!-- attributes configuration slot -->
        <slot name="attributes" />
        <!-- collapse-bar -->
        <div @click="collapseBanner" class="editor-aside-bar">
          <el-icon size="20">
            <component :is="collapseIcon" />
          </el-icon>
        </div>
      </div>
    </DrawerTransition>
    <div
      style="border-top: 1px solid #e4e7ed;"
      class="w-[60px] h-full flex flex-col bg-header-dark"
    >
      <slot name="side" />
    </div>
  </div>
</template>

<style scoped>
.editor-aside {
  height: 100%;
}

.editor-aside-bar {
  width: 25px;
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 5px 0 0 5px;
  background-color: #fff;
  position: absolute;
  left: -25px;
  top: 50%;
  padding-left: 5px;
  cursor: pointer;
  z-index: 999;
}
</style>
