<script setup lang="ts">
import { ref } from 'vue';
import VisualCodeEditor from "@/plugin/plugin-code-generator/_components/VisualCodeEditor.vue";
import {$engine} from "@/renren-engine/engine";
import {$message} from "@/componsables/element-plus";

/** ========== 源码导出-start ========== **/
const exportFlag = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const sourceCode = ref<string>('');
const currentIndex = ref<string>('0');



async function exportSourceCode() {
  exportFlag.value = true;
  isLoading.value = true;
  await $engine.codeGenerator.getCodeTemplate().then(res => {
    sourceCode.value = res;
  }).catch(_ => {
    $message({
      type: 'warning',
      message: '代码生成失败'
    });
  });
  isLoading.value = false;
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
                   <el-button type="text">导出/下载 zip 包</el-button>
                 </div>
               </template>
               <div class="w-full h-[500px] flex flex-col">
                 <VisualCodeEditor :source-code="sourceCode" :is-loading="isLoading" />
               </div>
             </el-collapse-item>
             <!-- online shell view -->
             <el-collapse-item name="1" title="在线预览">
               <div class="w-full h-[500px] flex flex-col bg-yellow-500">

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
}
</style>
