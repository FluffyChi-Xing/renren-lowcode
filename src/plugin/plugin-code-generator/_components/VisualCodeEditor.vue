<script setup lang="ts">
import {onMounted, reactive, ref, shallowRef, watch} from "vue";
import { Editor } from '@guolao/vue-monaco-editor'


const props = withDefaults(defineProps<{
  sourceCode?: string;
  isLoading?: boolean;
}>(), {
  sourceCode: '',
  isLoading: false,
});



const fileInnerContext = ref<string>(props.sourceCode);
const editor = shallowRef();
function mountHandler(val: any[]) {
  editor.value = val;
}
const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true
};


onMounted(() => {
  // console.log(props.sourceCode, 'source-code');
  fileInnerContext.value = props.sourceCode;
});



watch(() => props.sourceCode, (newVal: string) => {
  fileInnerContext.value = newVal;
});
</script>

<template>
  <div class="w-full h-full grid grid-cols-4 gap-4">
    <el-skeleton
      animated
      :rows="7"
      :loading="isLoading"
    >
      <!-- file tree -->
      <div class="w-full h-full flex flex-col bg-red-500">
        <el-scrollbar>

        </el-scrollbar>
      </div>
      <!-- file-info-view -->
      <div class="w-full h-full flex flex-col items-center justify-center col-span-3">
        <Editor
          v-model:value="fileInnerContext"
          theme="vs-dark"
          language="html"
          style="width: 100%;height: 100%;"
        />
      </div>
    </el-skeleton>
  </div>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
