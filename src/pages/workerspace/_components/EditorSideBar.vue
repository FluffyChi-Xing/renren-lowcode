<script setup lang="ts">
import { ref } from 'vue';
import {$message} from "@/componsables/element-plus";
import {$engine} from "@/renren-engine/engine";
import $event from "@/componsables/utils/EventBusUtil";
import {useSchemaStore} from "@/stores/schema";





const schemaStore = useSchemaStore();
const emits = defineEmits(['clear', 'schema']);
/**
 * @description 清空画布
 */
async function clearCanvas() {
  await $engine.arrangement.clearMaterialNodes().then(() => {
    emits('clear')
    $event.emit('clearCanvas');
    schemaStore.currentElement = undefined;
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
 * @description 查看页面 schema 代码
 */
function checkSchema() {
  emits('schema');
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


/**
 * @description 锁定物料
 */
function lockMaterial() {
  $event.emit('lockMaterial');
}


/**
 * @description 解锁物料
 */
function unLockMaterial() {
  $event.emit('unLockMaterial');
}


const functionList = ref<RenrenInterface.KeyValueIndexType<Function, string>[]>([
  {
    key: 'JSON',
    value: checkSchema,
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
    key: '锁定',
    value: lockMaterial,
    index: 'Lock'
  },
  {
    key: '解锁',
    value: unLockMaterial,
    index: 'Unlock'
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
  </div>
</template>

<style scoped>
:deep(.el-button) {
  margin-left: 0;
  margin-bottom: 16px;
}
</style>
