<script setup lang="ts">
import {ref, shallowRef} from 'vue';
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import DrawerTransition from "@/components/DrawerTransition.vue";
import useSchemaStore from "@/stores/schema";

const isCollapse = ref<boolean>(false);
const schemaStore = useSchemaStore();
const emits = defineEmits(['collapse']);
const toolBarIcon = shallowRef(ArrowLeft);


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

/**
 * @description 处理鼠标点击在画布外的，物料失焦事件
 * @param e
 */
function outerCanvasClickHandler(e: MouseEvent) {
  e.stopPropagation();
  schemaStore.initCurrentElement2undefined();
}
</script>

<template>
  <DrawerTransition>
    <div
      class="material-aside grid grid-rows-3 gap-4 bg-white relative shadow-sm"
      :class="isCollapse ? 'w-10' : 'w-[90%]'"
      style="padding: 16px;"
      @click="outerCanvasClickHandler"
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
  filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.1));
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
  transition: .5s all ease;
}
</style>
