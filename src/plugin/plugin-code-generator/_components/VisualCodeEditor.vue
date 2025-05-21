<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import { Editor } from '@guolao/vue-monaco-editor'
import structure from '../mock/code-structure.json';
import {$util} from "@/componsables/utils";
import SvgIcon from "@/components/SvgIcon.vue";
import counterData from '../mock/counter-store.json';
import baseCSS from '../mock/base-css.json';
import indexHtml from '../mock/index-html.json';
import appVue from '../mock/app-vue.json';
import readme from '../mock/readme.json';
import indexTs from '../mock/router.json';
import mainTs from '../mock/main-js.json';
import {$message} from "@/componsables/element-plus";
import packageJson from '../mock/package-json.json';
import tsConfig from '../mock/ts-config.json';
import viteConfig from '../mock/vite-config.json';
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";


const props = withDefaults(defineProps<{
  isLoading?: boolean;
  // 自动生成的文件映射表
  sources?: Map<string, string> | undefined;
  keys?: string[];
}>(), {
  isLoading: false,
  keys: () => [],
});



const fileInnerContext = ref<string>();
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
  ['BaseCSS', baseCSS],
  ['indexHtml', indexHtml],
  ['AppVue', appVue],
  ['readMeMd', readme],
  ['indexTs', indexTs],
  ['mainTs', mainTs],
  ['packageJson', packageJson],
  ['tsconfig', tsConfig],
  ['viteConfig', viteConfig],
]);

function initRef(name: string, el: HTMLElement | null | unknown) {
  if (treeItemRefs.value && el instanceof HTMLElement) {
    treeItemRefs.value[name] = el;
  }
}

function initFileContext() {
  if (props.sources) {
    fileInnerContext.value = props.sources.get(props.keys[0] as string);
  }
}



async function itemHighLight(key: string) {
  if (treeItemRefs.value) {
    Object.values(treeItemRefs.value).forEach(el => {
      if (el && el.classList.contains('is-active')) {
        el.classList.remove('is-active');
      }
    });

    // 给当前节点添加 is-active 类
    const currentEl = treeItemRefs.value[key];
    if (currentEl) {
      currentEl.classList.add('is-active');
    }
  }
}

async function checkSourceCode(node: WorkerSpaceInterface.IFileTree) {
  currentNode.value = node;
  // 清除所有节点的 is-active 类
  await itemHighLight(node.label?.name);
  // 获取文件 name 中 . 后的文件后缀名，判断当前预览文件的语言
  let suffix: string = fileSuffix2languageMap.get(node.label?.name.split('.').pop() as string) as string;
  if (treeItemRefs.value) {

    if (suffix === 'ico') {
      $message({
        type: 'warning',
        message: `${suffix}格式的文件暂不支持预览`
      });
      return;
    }
    if (props.sources) {
      // 处理自定义页面对应的预览逻辑
      let name: string = node?.label.name.split('.').slice(0, -1).join('.');
      if (!props.sources.has(name)) {
        // 处理对应的代码预览
        let code: RenrenInterface.keyValueType<string> = defaultFileMap.get(node.label?.path) as RenrenInterface.keyValueType<string>;
        if (code !== void 0) {
          fileInnerContext.value = code.value;
          currentLan.value = suffix;
        }
      } else {
        fileInnerContext.value = props.sources.get(name) as string;
        currentLan.value = suffix;
      }
    }
  }
}


/**
 * @description 初始化文件目录树
 */
function initFileTree() {
  // 默认在挂载的时候打开的是 pages 文件夹下的第一个页面文件
  initFileContext();
  if (generateFileStructure.value !== void 0) {
    // 创建页面文件
    if (props.sources) {
      props.sources.forEach(async (value, key) => {
        let file: WorkerSpaceInterface.IFileTree = {
          children: [],
          id: "",
          label: {
            icon: "",
            name: "",
            path: ""
          }
        };
        // 初始化新的页面 file tree item
        file.id = generateUUID();
        let name: string = key.concat('.vue');
        file.label = {
          icon: "Vue",
          name: name,
          path: value
        }
        async function insertNewFile(list: WorkerSpaceInterface.IFileTree): Promise<string> {
          return new Promise<string>((resolve) => {
            if (list !== void 0 && list?.children.length > 0) {
              list?.children?.forEach(item => {
                insertNewFile(item);
              });
            } else {
              if (list.label?.name === 'pages') {
                list.children?.push(file);
              }
            }
            resolve('success');
          });
        }
        await insertNewFile(generateFileStructure.value[0]).then(async () => {
          await itemHighLight(name);
        });
      });
    }
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
  // TODO: 后期需要对接接口，从后端请求同属于该项目下的其他页面列表
  initFileTree();
});



watch(() => props.sources, () => {
  initFileContext();
});


// 初始化
onUnmounted(() => {
  clearDataBinding();
});
</script>

<template>
  <div class="w-full h-full grid grid-cols-4 gap-2">
    <el-skeleton
      animated
      :rows="7"
      :loading="isLoading"
    >
      <!-- file tree -->
      <div class="w-full h-full flex flex-col">
        <el-scrollbar height="500">
          <div class="w-[250px] h-auto flex flex-col pb-4">
            <el-tree
              class="h-full"
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
          </div>
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
  width: 180px;
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
