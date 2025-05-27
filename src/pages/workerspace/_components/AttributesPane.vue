<script setup lang="ts">/**
 * @description 物料属性匹配面板
 * @author FluffyChi-Xing
 */
import {mySchemaStore} from "@/stores/schema";
import {ref, h, watch, onMounted} from 'vue';
import type { Component } from 'vue';
import {ElEmpty} from "element-plus";
import DocumentAttributesPane from "@/pages/workerspace/_components/Attributes/DocumentAttributesPane.vue";
import MaterialAttributesPane from "@/pages/workerspace/_components/Attributes/MaterialAttributesPane.vue";
import MaterialAnimationPane from "@/pages/workerspace/_components/Attributes/MaterialAnimationPane.vue";
import EventAttributesPane from "@/pages/workerspace/_components/Attributes/EventAttributesPane.vue";
import $event from "@/componsables/utils/EventBusUtil";
import attributeOptions from './attributesOption.json';


const currentTabIndex = ref<string>('1');
const isShow = ref<boolean>(false);
const tabPaneList = ref<RenrenInterface.keyValueType<string>[]>(JSON.parse(JSON.stringify(attributeOptions)));
const attributeTabPane = ref<Component>(MaterialAttributesPane || h(ElEmpty) as Component);


/**
 * @description 判断是否是一个文档节点
 */
function isDocumentModel(): boolean {
  const item: any = mySchemaStore.currentElement;
  if (item !== void 0) {
    if (item?.type === 'document') {
      return item.rootNode;
    } else {
      return false;
    }
  } else {
    return false;
  }
}



watch(() => currentTabIndex.value, (newVal: string) => {
  if (newVal) {
    switch (newVal) {
      case '1':
        attributeTabPane.value = MaterialAttributesPane;
        break;
      case '2':
        attributeTabPane.value = MaterialAnimationPane;
        break;
      case '3':
        attributeTabPane.value = EventAttributesPane;
        break;
      default:
        attributeTabPane.value = h(ElEmpty) as Component
        break;
    }
  }
});




$event.on('clearCanvas', () => {
  // 当清空画布事件发生后，对属性面板进行重置
  currentTabIndex.value = '1';
});


onMounted(() => {
  isShow.value = mySchemaStore.currentElement !== void 0;
});


watch(() => mySchemaStore.currentElement, () => {
  isShow.value = mySchemaStore.currentElement !== void 0;
}, {
  deep: true
})
</script>

<template>
  <el-scrollbar height="628">
    <div class="w-full h-full flex flex-col">
      <!-- 空页面 -->
      <div
        v-if="!isShow"
        class="w-full h-auto flex items-center mt-10 justify-center text-black"
      >
        请在左侧画布中选中节点
      </div>
      <!-- 页面属性适配器 -->
      <!-- 如果 currentElement 为 document model 节点，则认为是页面元素 -->
      <div
        v-else
        class="w-full h-full flex flex-col"
      >
        <el-tabs
          v-if="isDocumentModel()"
          class="w-full h-full"
        >
          <el-tab-pane label="属性">
            <DocumentAttributesPane />
          </el-tab-pane>
          <el-tab-pane label="高级">
            <el-empty description="暂无数据" />
          </el-tab-pane>
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
    </div>
  </el-scrollbar>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  width: 100%;
  height: 100%;
}
</style>
