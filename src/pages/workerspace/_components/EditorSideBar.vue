<script setup lang="ts">
import { ref } from 'vue';
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {createSchema} from "@/renren-engine/arrangement/arrangement";
import {$message} from "@/componsables/element-plus";






const emits = defineEmits(['clear']);
/**
 * @description 清空画布
 */
async function clearCanvas() {
  await createSchema().then(() => {
    emits('clear')
    $message({
      type: 'info',
      message: '清空画布成功'
    });
  }).catch(err => {
    $message({
      type: 'warning',
      message: err
    });
  });
}


const functionList = ref<RenrenInterface.KeyValueIndexType<Function, string>[]>([
  {
    key: 'JSON',
    value: () => {},
    index: 'Document'
  },
  {
    key: '插入图片',
    value: () => {},
    index: 'PictureRounded'
  },
  {
    key: '清空画布',
    value: clearCanvas,
    index: 'Delete'
  },
  {
    key: '锁定',
    value: () => {},
    index: 'Lock'
  },
  {
    key: '解锁',
    value: () => {},
    index: 'Unlock'
  }
]);
</script>

<template>
  <div class="w-full h-full flex flex-col items-center py-10">
    <el-tooltip
      v-for="(item, index) in functionList"
      :key="index"
      effect="dark"
      placement="left"
      :content="item.key"
    >
      <el-button
        :icon="item.index"
        circle
        @click="item.value"
      />
    </el-tooltip>
  </div>
</template>

<style scoped>
:deep(.el-button) {
  margin-left: 0;
  margin-bottom: 16px;
}
</style>
