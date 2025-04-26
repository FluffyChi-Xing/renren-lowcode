<script setup lang="ts">
import {Delete, Setting} from "@element-plus/icons-vue";
import { ref } from 'vue';
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";

const props = withDefaults(defineProps<{
  icon?: string;
  name?: string;
  index?: string | number;
  item?: MaterialInterface.MaterialTreeType | undefined;
  type?: string;
}>(), {
  icon: 'Menu',
  name: '未命名',
  index: '1',
  item: undefined,
  type: 'document'
});



const isShow = ref<boolean>(false);
const emits = defineEmits(['editDocument', 'editMaterial', 'delDocument', 'delMaterial']);

/**
 * @description 控制功能按钮显示隐藏
 * @param e
 */
function showFunctionalBanner(e: MouseEvent) {
  e?.stopPropagation();
  isShow.value = true;
}


/**
 * @description 处理 编辑物料/文档 事件
 */
function settingItemHandler(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (props.item !== void 0) {
        if (props.item?.type === 'material') {
          emits('editMaterial');
        } else if (props.item?.type === 'document') {
          emits('editDocument');
        }
        resolve('设置物料成功');
      }
    } catch (e) {
      console.error('设置物料失败', e);
      reject('设置物料失败');
    }
  });
}
</script>

<template>
  <div
    @mouseenter="showFunctionalBanner"
    @mouseleave="() => isShow = false"
    class="w-full h-8 grid text-black cursor-pointer grid-cols-2 gap-2 items-center px-4 mb-1 hover:bg-blue-200 hover:text-blue-500"
  >
    <div
      :class="props.type === 'material' ? 'pl-4' : ''"
      class="w-full h-full flex items-center overflow-hidden"
    >
      <!-- icon -->
      <el-icon class="mr-2">
        <component :is="icon"/>
      </el-icon>
      <!-- name -->
      <el-tooltip
        placement="bottom"
        effect="dark"
        :content="name"
      >
        <div class="w-full h-auto flex items-center whitespace-nowrap">{{ name }}</div>
      </el-tooltip>
    </div>
    <!-- functional banner -->
    <div
      v-show="isShow"
      class="w-full h-full flex items-center justify-end"
    >
      <!-- edit -->
      <el-icon @click="settingItemHandler" class="mr-4 cursor-pointer">
        <Setting />
      </el-icon>
      <!-- delete -->
      <el-icon class="cursor-pointer">
        <Delete />
      </el-icon>
    </div>
  </div>
</template>

<style scoped>

</style>
