<script setup lang="ts">
import { ref } from 'vue';
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {ElEmpty} from "element-plus";
import {$message} from "@/componsables/element-plus";
withDefaults(defineProps<{
  paneComp?: HTMLElement | any;
}>(), {
  paneComp: ElEmpty
});




const defaultPaneIndex = ref<string>('1');
const searchValue = ref<string>('');
const tabPaneList = ref<RenrenInterface.keyValueType<string>[]>([
  {
    key: '1',
    value: '基础组件'
  },
  {
    key: '2',
    value: '表单组件'
  },
  {
    key: '3',
    value: '图表组件'
  },
  {
    key: '4',
    value: '导航组件'
  },
  {
    key: '5',
    value: '布局组件'
  }
]);

const emits = defineEmits(['change', 'search']);


/**
 * @description 处理 tab 切换事件
 */
function tabChangeHandler(index: string) {
  emits('change', index);
}


/**
 * @description 处理搜索组件事件
 */
function searchCompHandler() {
  if (searchValue.value) {
    emits('search', searchValue.value);
  } else {
    $message({
      type: 'warning',
      message: '请输入组件名称',
    });
  }
}
</script>

<template>
  <el-scrollbar height="400">
    <div class="w-full h-full flex flex-col">
      <!-- title -->
      <p class="text-[1.2rem] text-black font-bold">组件库</p>
      <!-- search -->
      <el-input
        v-model="searchValue"
        clearable
        placeholder="请输入组件名称"
        prefix-icon="Search"
        class="w-full my-4"
        size="small"
        @keydown.enter="searchCompHandler"
      />
      <!-- material components -->
      <el-tabs
        v-model="defaultPaneIndex"
        @tabChange="tabChangeHandler"
        class="w-full h-full select-none"
      >
        <!-- tab-pane -->
        <el-tab-pane
          v-for="(item, index) in tabPaneList"
          :key="index"
          :label="item.value"
          :name="item.key"
        />
        <!-- component -->
        <component :is="paneComp" />
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
  width: 100%;
}
</style>
