<template>
  <!-- 物料节点树 -->
  <div class="w-full h-full flex flex-col">
   <el-scrollbar height="200">
     <!-- header -->
     <div
       class="w-full h-8 flex items-center justify-between"
     >
       <span>物料节点树</span>
       <el-tooltip
         effect="dark"
         content="刷新"
         placement="right"
       >
         <el-icon
           @click="refresh"
           size="15"
           class="cursor-pointer"
         >
           <Refresh />
         </el-icon>
       </el-tooltip>
     </div>
     <NodeTreeItem
       v-for="(item, index) in componentList"
       :key="index"
       :name="item.name"
       :icon="item.icon"
       :index="item.index"
       :type="item.type"
       :item="item"
       @edit-document="settingDocumentHandler"
     />
   </el-scrollbar>
  </div>
  <!-- edit-document -->
  <BaseDialog
    v-model:show="showDocEditor"
    title="编辑页面名称"
    :footer="true"
    width="500"
  >
    <template #default>
      <el-form-item label="页面名称" required>
        <el-input
          v-model="documentNodeName"
          clearable
          placeholder="请输入页面名称"
          style="width: 240px;"
        />
      </el-form-item>
    </template>
    <template #footer>
      <div class="w-full h-auto flex items-center justify-end">
        <el-button @click="editDocumentNameHandler" type="primary">确认</el-button>
        <el-button @click="() => showDocEditor = false" type="info">取消</el-button>
      </div>
    </template>
  </BaseDialog>
</template>

<style scoped>
:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {MaterialDocumentModel, MaterialTreeModel} from "@/componsables/models/MaterialModel";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {$message} from "@/componsables/element-plus";
import NodeTreeItem from "@/pages/workerspace/_components/NodeTree/NodeTreeItem.vue";
import {Refresh} from "@element-plus/icons-vue";
import $event from "@/componsables/utils/EventBusUtil";
import BaseDialog from "@/components/BaseDialog.vue";
import {$util} from "@/componsables/utils";
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";
import {useCanvasStore} from "@/stores/canvas";


const componentList = ref<MaterialTreeModel[]>([]);
const canvasStore = useCanvasStore();
const showDocEditor = ref<boolean>(false);
const documentNodeName = ref<string>();
const engine = container.resolve<IEngine>('engine');
// tree item index table
const componentIndexMap = ref<Map<string, MaterialTreeModel>>(
  new Map()
);
// TODO: 适配撤销&反做事件


/**
 * @description 初始化节点树 仅在 onMounted 的时候触发
 */
function initTreeList(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      // init componentList
      componentList.value = [];
      // get currentDocument
      let document: MaterialInterface.IDocument | undefined;
      document = engine.arrangement.getDocument(canvasStore.currentDocName);
      if (document !== void 0) {
        let newNode: MaterialTreeModel = new MaterialTreeModel({
          children: [],
          icon: "Document",
          index: document?.fileName || 'index',
          name: document?.fileName || 'index',
          parentId: undefined,
          type: "root"
        });
        // insert root node
        componentList.value.push(newNode);
        componentIndexMap.value.set(newNode.index as string, newNode);
        // insert children nodes
        if (Array.isArray(document?.nodes) && document.nodes.length > 0) {
          document.nodes.forEach((item: MaterialInterface.IMaterial) => {
            newNode = new MaterialTreeModel({
              children: [],
              icon: item.icon || 'Close',
              index: item?.id || 'unknown',
              name: item?.title || 'title',
              parentId: undefined,
              type: "node"
            });
            componentList.value.push(newNode);
            if (componentIndexMap.value !== void 0) {
              componentIndexMap.value.set(newNode.index as string, newNode);
            }
          });
        }
        resolve('初始化大纲树成功');
      }
    } catch (e) {
      console.error('初始化大纲树失败', e);
      reject('初始化大纲树失败');
    }
  });
}


/**
 * @description 刷新节点树
 */
function refresh() {
  let components: MaterialInterface.IMaterial[];
  components = engine.arrangement.getAllElementNodes();
  if (Array.isArray(components) && components.length > 0) {
    components.forEach(item => {
      if (!componentIndexMap.value.has(item.id)) {
        let newNode: MaterialTreeModel = new MaterialTreeModel({
          children: [],
          icon: item.icon || 'Close',
          index: item?.id || 'unknown',
          name: item?.title || 'title',
          parentId: undefined,
          type: "node"
        });
        componentList.value.push(newNode);
        componentIndexMap.value.set(newNode.index as string, newNode);
      }
    });
  }
}




/**
 * @description 清空节点树
 */
function clearTreeNode(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      componentList.value = componentList.value.filter(item => item.type === 'root');
      componentIndexMap.value.clear();
      resolve('清空节点成功');
    } catch (e) {
      console.error('清空节点失败', e);
      reject('清空节点失败');
    }
  });
}


/**
 * @description 处理编辑文档事件
 */
async function settingDocumentHandler() {
  showDocEditor.value = true;
  let document: MaterialInterface.IDocument | undefined = engine.arrangement.getDocument();
  const documentNode: MaterialDocumentModel = new MaterialDocumentModel(document);
  if (documentNode !== void 0) {
    if (!$util.renren.isEmpty(documentNode)) {
      documentNodeName.value = documentNode.fileName ?? '未知页面';
    }
  }
}


/**
 * @description 处理修改 document node 名称事件
 */
function editDocumentNameHandler() {
  if (documentNodeName.value) {
    showDocEditor.value = false;
    engine.arrangement.editDocumentName(documentNodeName.value).then(async () => {
      // 更新 tree list 中 document node 的名称
      let documentNode: MaterialTreeModel | undefined = componentList.value[0];
      if (documentNode !== void 0 && documentNode?.name) {
        documentNode.name = documentNodeName.value ? documentNodeName.value : '未知节点';
        componentList.value[0] = documentNode;
      }
      $message({
        type: 'info',
        message: '修改页面名称'
      });
    }).catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
  }
}

/**
 * @description 处理物料插入事件
 */
$event.on('insert', async () => {
  refresh();
});


/**
 * @description 处理画布清空事件
 */
$event.on('clearCanvas', () => {
  clearTreeNode().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
});


$event.on('deleteNode', async () => {
  await initTreeList().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
});


onMounted(async () => {
  await initTreeList().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
});
</script>
