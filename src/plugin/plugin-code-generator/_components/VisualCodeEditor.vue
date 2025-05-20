<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import { Editor } from '@guolao/vue-monaco-editor'
import structure from '../mock/code-structure.json';
import {$util} from "@/componsables/utils";
import SvgIcon from "@/components/SvgIcon.vue";
import counterData from '../mock/counter-store.json';


const props = withDefaults(defineProps<{
  sourceCode?: string;
  isLoading?: boolean;
}>(), {
  sourceCode: '',
  isLoading: false,
});



const fileInnerContext = ref<string>(props.sourceCode);
const generateFileStructure = ref<WorkerSpaceInterface.IFileTree[]>(
  $util.renren.jsonTypeTransfer<WorkerSpaceInterface.IFileTree[]>(structure)
);
const currentNode = ref<WorkerSpaceInterface.IFileTree>();
const treeItemRefs = ref<Record<string, HTMLElement>>({});
const currentLan = ref<string>('html');
const fileSuffix2languageMap: Map<string, string> = new Map<string, string>(
  [
    ['html', 'html'],
    ['css', 'css'],
    ['js', 'javascript'],
    ['ts', 'typescript'],
    ['json', 'json'],
    ['vue', 'html'],
    ['md', 'markdown'],
    ['tsx', 'typescript'],
    ['jsx', 'javascript'],
    ['scss', 'scss'],
    ['less', 'less'],
    ['styl', 'stylus'],
    ['ts', 'typescript'],
  ]
);

const defaultFileMap: Map<string, unknown> = new Map<string, unknown>([
  // 默认 pinia store 文件
  ['counterTs', counterData],
]);

function initRef(name: string, el: HTMLElement | null | unknown) {
  if (treeItemRefs.value && el instanceof HTMLElement) {
    treeItemRefs.value[name] = el;
  }
}

function checkSourceCode(node: WorkerSpaceInterface.IFileTree) {
  currentNode.value = node;

  // 清除所有节点的 is-active 类
  if (treeItemRefs.value) {
    Object.values(treeItemRefs.value).forEach(el => {
      if (el && el.classList.contains('is-active')) {
        el.classList.remove('is-active');
      }
    });

    // 给当前节点添加 is-active 类
    const currentEl = treeItemRefs.value[node.label?.name];
    if (currentEl) {
      currentEl.classList.add('is-active');
    }

    // 处理对应的代码预览
    let code: RenrenInterface.keyValueType<string> = defaultFileMap.get(node.label?.path) as RenrenInterface.keyValueType<string>;
    if (code !== void 0) {
      fileInnerContext.value = code.value;
      // 获取文件 name 中 . 后的文件后缀名，判断当前预览文件的语言
      currentLan.value = fileSuffix2languageMap.get(node.label?.name.split('.').pop() as string) as string;
    }
  }
}


function initFileTree() {
  if (generateFileStructure.value !== void 0) {
    // 处理 file-tree 文件结构，在 pages 文件夹下创建页面信息
    // 并将 pages 的第一个页面文件选中
    // TODO: 后期需要对接接口，从后端请求同属于该项目下的其他页面列表
  }
}


function clearDataBinding() {
  generateFileStructure.value = [];
  fileInnerContext.value = '';
  currentLan.value = 'html';
  currentNode.value = void 0;
  treeItemRefs.value = {};
}



onMounted(() => {
  // 默认在挂载的时候打开的是 pages 文件夹下的第一个页面文件
  fileInnerContext.value = props.sourceCode;
  // 处理 file-tree 文件结构，在 pages 文件夹下创建页面信息
  // 并将 pages 的第一个页面文件选中
  // TODO: 后期需要对接接口，从后端请求同属于该项目下的其他页面列表
});



watch(() => props.sourceCode, (newVal: string) => {
  fileInnerContext.value = newVal;
});


// 初始化
onUnmounted(() => {
  clearDataBinding();
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
      <div class="w-full h-full flex flex-col">
        <el-scrollbar>
          <el-tree
            class="w-[200px] h-full"
            :data="generateFileStructure"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
            <template #default="{ node }">
              <div
                :ref="(el) => initRef(node?.label?.name, el)"
                @click="checkSourceCode(node)"
                class="w-full tree-item hover:bg-gray-300 px-2 py-1 h-auto flex items-center"
              >
                <div class="w-5 h-5 flex">
                  <SvgIcon size="20" :icon-class="node?.label?.icon" />
                </div>
                <el-tooltip
                  effect="light"
                  placement="right"
                  :content="node?.label?.name"
                >
                  <span class="ml-4 text-sm">{{ node?.label?.name }}</span>
                </el-tooltip>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <!-- file-info-view -->
      <div class="w-full h-full flex flex-col items-center justify-center col-span-3">
        <Editor
          v-model:value="fileInnerContext"
          theme="vs-dark"
          :language="currentLan"
          style="width: 100%;height: 100%;"
        />
      </div>
    </el-skeleton>
  </div>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
  width: 100%;
}

.tree-item {
  transition: all .4s ease;
}

.tree-item {
  &.is-active {
    background-color: #E2E2E3;
    color: #000000;
    border-radius: 4px;
  }
}
</style>
