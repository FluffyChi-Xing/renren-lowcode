<script setup lang="ts">
import { ref } from 'vue';
import VisualCodeEditor from "@/plugin/plugin-code-generator/_components/VisualCodeEditor.vue";
import {$engine} from "@/renren-engine/engine";
import $event from "@/componsables/utils/EventBusUtil";
import {useRoute} from "vue-router";

/** ========== 源码导出-start ========== **/
const exportFlag = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const currentIndex = ref<string>('0');
const route = useRoute();
// 所有低代码页面 名称转换源码映射表
const sourceCodes = ref<Map<string, string>>();
const sourceCodesKeys = ref<string[]>([]);



async function exportSourceCode() {
  exportFlag.value = true;
  isLoading.value = true;
  await $engine.codeGenerator.getAllCodeTemplates().then(res =>{
    sourceCodes.value = res?.templates;
    sourceCodesKeys.value = res.keys;
  }).catch(err => {
    console.error(err);
  });
  isLoading.value = false;
}


function exportCode() {
  $event.emit('exportCode');
}
/** ========== 源码导出-end ========== **/
</script>

<template>
  <div>
    <!-- 出码 -->
    <el-button @click="exportSourceCode" type="primary">出码</el-button>
    <!-- source code generator drawer -->
    <el-drawer
      v-model="exportFlag"
      :direction="'rtl'"
      size="50%"
      :close-on-click-modal="false"
      :show-close="false"
      :destroy-on-close="true"
    >
      <template #header>
        <div class="w-full h-auto flex items-center justify-between">
          <span class="text-black font-bold text-md">出码结果</span>
          <el-button @click="() => exportFlag = false" type="text" icon="Close">关闭</el-button>
        </div>
      </template>
      <template #default>
        <div class="w-full h-full flex flex-col gap-4">
         <el-scrollbar>
           <el-collapse v-model="currentIndex" accordion class="w-full h-full">
             <!-- file editor view -->
             <el-collapse-item name="0">
               <template #title>
                 <div class="w-full h-auto flex items-center justify-between">
                   <span class="text-black font-bold">出码生成的源代码</span>
                   <a @click="exportCode" href="/#/workerspace" class="text-blue-700 hover:underline hover:text-blue-500">导出/下载 zip 包</a>
                 </div>
               </template>
               <div class="w-full h-[500px] flex flex-col">
                 <VisualCodeEditor
                   v-model:is-loading="isLoading"
                   v-model:sources="sourceCodes"
                   v-model:keys="sourceCodesKeys"
                 />
               </div>
             </el-collapse-item>
             <!-- online shell view -->
             <el-collapse-item name="1" title="在线预览">
               <div class="w-full h-[500px] flex flex-col items-center justify-center">
                 <el-empty
                   description="暂未支持"
                 />
               </div>
             </el-collapse-item>
           </el-collapse>
         </el-scrollbar>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
  width: 100%;
}
</style>
