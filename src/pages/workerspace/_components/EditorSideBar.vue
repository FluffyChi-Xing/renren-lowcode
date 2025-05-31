<script setup lang="ts">
import { ref } from 'vue';
import {$message} from "@/componsables/element-plus";
import $event from "@/componsables/utils/EventBusUtil";
import LockUnlock from "@/pages/workerspace/_components/EditorConfig/LockUnlock.vue";
import {mySchemaStore} from "@/stores/schema";
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";




const engineInstance = container.resolve<IEngine>('engine');
/**
 * @description 清空画布
 */
async function clearCanvas() {
  await engineInstance.arrangement.clear().then(() => {
    $event.emit('clearCanvas');
    mySchemaStore.currentElement = undefined;
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


/**
 * @description 页面刷新
 */
function refreshPage() {
  location.reload();
}


/**
 * @description 截取页面图片
 */
function takeScreenPhoto() {
  $event.emit('takePhoto');
}


const functionList = ref<RenrenInterface.KeyValueIndexType<Function, string>[]>([
  {
    key: 'Schema Json',
    value: () => $event.emit('showSchema'),
    index: 'Document'
  },
  {
    key: '截取图片',
    value: takeScreenPhoto,
    index: 'PictureRounded'
  },
  {
    key: '清空画布',
    value: clearCanvas,
    index: 'Delete'
  },
  {
    key: '刷新',
    value: refreshPage,
    index: 'Refresh'
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
    <!-- 解锁与锁定 -->
    <LockUnlock />
  </div>
</template>

<style scoped>
:deep(.el-button) {
  margin-left: 0;
  margin-bottom: 16px;
}
</style>
