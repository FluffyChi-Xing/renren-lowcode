<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import { Editor } from '@guolao/vue-monaco-editor'
import {$util} from "@/componsables/utils";
import SvgIcon from "@/components/SvgIcon.vue";
import {$message} from "@/componsables/element-plus";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";
import {fileSuffix2languageMap} from "@/renren-engine/componsables/constants/EngineConstants";
import $event from "@/componsables/utils/EventBusUtil";
import * as mockData from '../mock/index';
import { ROUTER_CONTEXT } from "@/plugin/plugin-code-generator/common/constant";
import CoreEngine from "@/renren-engine";


const props = withDefaults(defineProps<{
  isLoading?: boolean;
  // 自动生成的文件映射表
  sources?: Map<string, string> | undefined;
  keys?: string[];
}>(), {
  isLoading: false,
  keys: () => [],
});



const engine = new CoreEngine();
const fileInnerContext = ref<string>();
const generateFileStructure = ref<WorkerSpaceInterface.IFileTree[]>([]);
const currentNode = ref<WorkerSpaceInterface.IFileTree>();
const treeItemRefs = ref<Record<string, HTMLElement>>({});
const currentLan = ref<string>('html');

const defaultFileMap: Map<string, unknown> = new Map<string, unknown>([
  // 默认 pinia store 文件
  ['counterTs', mockData.counterData],
  ['BaseCSS', mockData.baseCSS],
  ['indexHtml', mockData.indexHtml],
  ['AppVue', mockData.appVue],
  ['readMeMd', mockData.readme],
  ['mainTs', mockData.mainTs],
  ['packageJson', mockData.packageJson],
  ['tsconfig', mockData.tsConfig],
  ['viteConfig', mockData.viteConfig],
]);

function initRef(name: string, el: HTMLElement | null | unknown) {
  if (treeItemRefs.value && el instanceof HTMLElement) {
    treeItemRefs.value[name] = el;
  }
}


/**
 * @description 用于将默认文件的内容与文件节点进行绑定
 * @param list
 */
function initFileData(list: WorkerSpaceInterface.IFileTree[]) {
  if (Array.isArray(list) && list.length > 0) {
    list.forEach(item => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        initFileData(item.children);
      } else {
        let name: string = item.label?.path as string;
        if (item.label.icon !== 'folder' && defaultFileMap.has(name)) {
          // 判断是否是路由文件
          if (item.label.name === 'router') {
            item.label.data = ROUTER_CONTEXT();
          } else {
            item.label.data = (defaultFileMap.get(name) as RenrenInterface.keyValueType<string>).value;
          }
        }
      }
    });
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
        let code: RenrenInterface.keyValueType<string>;
        if (node.label.path !== 'indexTs') {
          code = defaultFileMap.get(node.label?.path) as RenrenInterface.keyValueType<string>;
        } else {
          code = {
            key: 'router',
            value: node.label.data as string
          }
        }
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
 * @description 根据节点名称查找文件节点
 * @param list
 * @param name
 */
function queryFolderByName<T extends WorkerSpaceInterface.IFileTree>(
  list: T[],
  name: string
): T | undefined {
  for (const item of list) {
    if (item.label.name === name) {
      return item;
    }

    if (Array.isArray(item.children) && item.children.length > 0) {
      const result = queryFolderByName(item.children, name);
      if (result) {
        return result as T;
      }
    }
  }

  return undefined;
}





//TODO: insert pages info into router config
function insertRouteConfig<T extends WorkerSpaceInterface.IFileTree>(structure: T[], file: T): void {
  try {
    // get route folder
    let routeFolder: T | undefined = queryFolderByName(structure, 'router') as T;
    if (!$util.renren.isEmpty(routeFolder) && routeFolder.children.length > 0) {
      // build routes info list
      let config: WorkerSpaceInterface.IRoute = {
        meta: {
          title: file.label.name as string,
        },
        name: file.label.name as string,
        path: `/${file.label.name}`
      };
      let routes: WorkerSpaceInterface.IRoute[] = [config];
      generateFileStructure.value[0].children[1].children[4].children[0].label.data = ROUTER_CONTEXT(routes) as string;
    }
  } catch (e) {
    console.error('插入路由配置失败');
  }
}


/**
 * @description 同步新的页面文件
 * @param list
 * @param file
 */
function insertNewFile<T extends WorkerSpaceInterface.IFileTree>(list: T, file: T): void {
  if (list !== void 0) {
    if (list?.children.length > 0) {
      list?.children?.forEach(item => {
        insertNewFile(item, file);
      });
    } else {
      if (list.label?.name === 'pages') {
        list.children = [];
        list.children.push(file);
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
        let name: string = key.concat('.vue');
        let file: WorkerSpaceInterface.IFileTree = {
          children: [],
          id: "",
          label: {
            icon: "",
            name: "",
            path: "",
            data: ""
          }
        };
        // 初始化新的页面 file tree item
        file.id = generateUUID();
        file.label = {
          icon: "Vue",
          name: name,
          path: key,
          data: value
        }
        insertNewFile(generateFileStructure.value[0], file);
        insertRouteConfig(generateFileStructure.value, file);
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
  generateFileStructure.value = $util.renren.jsonTypeTransfer<WorkerSpaceInterface.IFileTree[]>(mockData.structure);
  // TODO: 后期需要对接接口，从后端请求同属于该项目下的其他页面列表
  initFileTree();
  initFileData(generateFileStructure.value);
});



watch(() => props.sources, () => {
  initFileContext();
});


$event.on('exportCode', async () => {
  if (generateFileStructure.value !== void 0) {
    await engine.exportModule.saveFile(
      generateFileStructure.value,
      (generateFileStructure.value[0])?.label.name as string,
    ).catch(_ => {
      $message({
        type: 'warning',
        message: '导出失败'
      });
    });
  }
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
