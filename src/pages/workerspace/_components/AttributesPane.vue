<script setup lang="ts">/**
 * @description 物料属性匹配面板
 * @author FluffyChi-Xing
 */
import {useSchemaStore} from "@/stores/schema";
import {ref, h} from 'vue';
import type { Component } from 'vue';
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {ElEmpty} from "element-plus";
import DocumentAttributesPane from "@/pages/workerspace/_components/Attributes/DocumentAttributesPane.vue";


const schemaStore = useSchemaStore();
const currentTabIndex = ref<string>('1');
const tabPaneList = ref<RenrenInterface.keyValueType<string>[]>([
  {
    key: '1',
    value: '属性'
  },
  {
    key: '2',
    value: '动画'
  },
  {
    key: '3',
    value: '事件'
  }
]);
const attributeTabPane = ref<Component>(DocumentAttributesPane || h(ElEmpty) as Component);
</script>

<template>
  <el-scrollbar height="628">
    <div class="w-full h-full flex flex-col">
      <!-- 页面属性适配器 -->
      <!-- 如果 currentElement 存在 rootNode 属性，则认为是页面元素 -->
      <el-tabs
        v-if="schemaStore.currentElement?.rootNode"
        class="w-full h-full"
      >
        <el-tab-pane></el-tab-pane>
      </el-tabs>
      <!-- 单组件属性适配器 -->
      <el-tabs
        v-else
        v-model="currentTabIndex"
        class="w-full h-full"
      >
        <el-tab-pane
          v-for="(item, index) in tabPaneList"
          :key="index"
          :label="item.value"
          :name="item.key"
        />
        <!-- 属性面板 -->
        <component :is="attributeTabPane" />
      </el-tabs>
    </div>
  </el-scrollbar>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  width: 100%;
  height: 100%;
}
</style>
