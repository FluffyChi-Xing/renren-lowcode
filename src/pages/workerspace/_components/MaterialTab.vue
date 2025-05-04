<script setup lang="ts">
import { ref } from 'vue';
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {ElEmpty} from "element-plus";
import {$message} from "@/componsables/element-plus";
import BaseMaterial from "@/components/material/BaseMaterial.vue";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {buttonSchema} from "@/material/base/Button";
import {textSchema} from "@/material/base/Text";
import {linkSchema} from "@/material/base/Link";
import {imageSchema} from "@/material/base/Image";
const props = withDefaults(defineProps<{
  paneComp?: HTMLElement | any
  index?: string;
}>(), {
  paneComp: ElEmpty,
  index: '1'
});




const defaultPaneIndex = ref<string>(props.index || '1');
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


/**
 * @description 物料类型和对应的物料列表映射表
 */
const materialList = ref<Record<string, RenrenMaterialModel[]>>({
  '1': [
    new RenrenMaterialModel(buttonSchema),
    new RenrenMaterialModel(textSchema),
    new RenrenMaterialModel(linkSchema),
    new RenrenMaterialModel(imageSchema)
  ],
  '2': [],
  '3': [],
  '4': [],
  '5': []
});
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
        >
          <!-- component -->
          <BaseMaterial
            :index="item.key"
            :material-data="materialList[item.key]"
          />
        </el-tab-pane>
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
