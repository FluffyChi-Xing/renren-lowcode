<script setup lang="ts">
import { ref } from 'vue';
import $event from "@/componsables/utils/EventBusUtil";
import {$util} from "@/componsables/utils";
import { Editor } from '@guolao/vue-monaco-editor';
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";
const schema2string = ref<string>('');
const isShow = ref<boolean>(false);



const engine = container.resolve<IEngine>('engine');
/**
 * @description 处理高亮 schema 事件
 */
async function showSchemaHandler() {
  isShow.value = !isShow.value;
  const schema = engine.arrangement.getDocument();
  if (!$util.renren.isEmpty(schema)) {
    schema2string.value = JSON.stringify(schema, null, 2);
  }
}

$event.on('showSchema', () => {
  showSchemaHandler();
});
</script>

<template>
  <el-drawer
    v-model="isShow"
    style="width: 300px;"
    direction="rtl"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <template #header>
      <div class="w-full h-auto flex items-center justify-between">
        <!-- title -->
        <span class="font-bold text-black">Schema</span>
        <!-- btns -->
        <div class="w-auto h-auto flex">
          <el-button type="primary" plain>导出</el-button>
          <el-button @click="isShow = false" type="info">关闭</el-button>
        </div>
      </div>
    </template>
    <template #default>
      <div class="w-full h-full flex flex-col">
        <!-- highlight-block -->
        <Editor
          v-model:value="schema2string"
          language="json"
          theme="vs-dark"
        />
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>

</style>
