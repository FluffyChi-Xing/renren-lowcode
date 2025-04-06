<script setup lang="ts">
import { ref } from 'vue';
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
const emits = defineEmits(['collapse']);
const toolBarIcon = ref(ArrowLeft);
import DrawerTransition from "@/components/DrawerTransition.vue";

const isCollapse = ref<boolean>(false);


/**
 * @description 梳理侧边栏折叠事件
 */
function collapseBanner() {
  isCollapse.value = !isCollapse.value
  emits('collapse', isCollapse.value);
  if (isCollapse.value) {
    toolBarIcon.value = ArrowRight;
  } else {
    toolBarIcon.value = ArrowLeft;
  }
}
</script>

<template>
  <DrawerTransition>
    <div
      class="material-aside grid grid-rows-3 gap-4 bg-white relative shadow-sm"
      :class="isCollapse ? 'w-10' : 'w-[90%]'"
      style="padding: 16px;"
    >
      <!-- components draggable area -->
      <div
        style="border-bottom: 1px solid #e4e7ed;"
        class="w-full h-full flex flex-col row-span-2 overflow-hidden"
      >
        <slot name="component" />
      </div>
      <!-- page element tree -->
      <div class="w-full h-full flex flex-col">
        <slot name="pageTree" />
      </div>
      <!-- material-tool-bar -->
      <div
        @click="collapseBanner"
        class="material-aside-toolbar"
      >
        <el-icon size="20">
          <component :is="toolBarIcon" />
        </el-icon>
      </div>
    </div>
  </DrawerTransition>
</template>

<style scoped>
.material-aside {
  height: 100%;
}

.material-aside-toolbar {
  width: 25px;
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 0 5px 5px 0;
  background-color: #fff;
  position: absolute;
  right: -25px;
  top: 50%;
  padding: 3px;
  cursor: pointer;
  z-index: 999;
}
</style>
