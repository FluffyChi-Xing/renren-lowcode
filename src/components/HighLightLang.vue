<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {registerHighLightLang} from "@/componsables/utils/HighLightUtil";
import {$message} from "@/componsables/element-plus";
import hljs from "highlight.js/lib/core";
import 'highlight.js/styles/dark.css';


const props = withDefaults(defineProps<{
  lang?: string;
  code?: string;
  height?: number | string;
}>(), {
  lang: 'json',
  code: '{}',
  height: 600,
});


// 需要高亮的代码
const highLightCode = ref<string | undefined>(props.code || '{}');


/**
 * @description 初始化代码高亮
 */
async function initHighLightCode() {
  try {
    // 注册需要高亮的语言
    await registerHighLightLang(props.lang).catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
    // 处理需要高亮的文本
    // 使用 highlight.js 高亮代码
    highLightCode.value = hljs.highlight(props.code, {
      language: props.lang || 'json'
    }).value;
    // console.log(highLightCode.value);
  } catch (e) {
    // console.log('初始化高亮代码失败', e);
    highLightCode.value = props.code;
  }
}



onMounted(async () => {
  await initHighLightCode();
});


watch(() => props.code, async (newVal: string) => {
  if (newVal) {
    await initHighLightCode();
  }
});
</script>

<template>
  <div class="w-full">
    <el-scrollbar :height="height">
    <pre class="w-full h-full">
      <code
        class="hljs h-full"
        v-html="highLightCode"
      />
    </pre>
    </el-scrollbar>
  </div>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  width: 100%;
  height: 100%;
}
</style>
