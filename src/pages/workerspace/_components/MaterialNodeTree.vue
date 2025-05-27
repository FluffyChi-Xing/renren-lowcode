<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {MaterialDocumentModel, MaterialTreeModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$engine} from "@/renren-engine/engine";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {$message} from "@/componsables/element-plus";
import NodeTreeItem from "@/pages/workerspace/_components/NodeTree/NodeTreeItem.vue";
import {Refresh} from "@element-plus/icons-vue";
import $event from "@/componsables/utils/EventBusUtil";
import BaseDialog from "@/components/BaseDialog.vue";
import {$util} from "@/componsables/utils";
import {mySchemaStore} from "@/stores/schema";





const materialNodeTreeList = ref<MaterialTreeModel[]>([]);
const showDocEditor = ref<boolean>(false);
const documentNodeName = ref<string>();
// const currentNode = ref<MaterialTreeModel | undefined>(undefined);


/**
 * @description 创建项目根节点
 * @param schema
 */
function createDocumentNode(schema: MaterialDocumentModel): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      // 先检查 materialNodeTreeList 中是否已经存在 document 节点
      // 如果存在则直接返回
      if (!materialNodeTreeList.value?.some(node => node.name === schema.fileName)) {
        const nodeSchema: MaterialInterface.MaterialTreeType = {
          children: [],
          icon: "Document",
          index: '',
          name: schema.fileName ? schema.fileName : '',
          parentId: undefined,
          type: 'document'
        };
        materialNodeTreeList.value?.push(new MaterialTreeModel(nodeSchema));
        resolve('插入 document 节点成功');
      }
    } catch (e) {
      console.error('插入 document 节点失败', e);
      reject('插入 document 节点失败');
    }
  });
}




/**
 * @description 插入物料到节点树中
 * @param nodes
 */
function insertMaterialNode(nodes: RenrenMaterialModel[] | undefined): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (nodes !== void 0 && nodes?.length > 0) {
        nodes?.forEach((node: RenrenMaterialModel) => {
          const existingNode: MaterialInterface.MaterialTreeType | undefined = materialNodeTreeList.value?.find(item => item.index.toString() === node.id);
          if (existingNode === void 0) {
            let params: MaterialInterface.MaterialTreeType = {
              children: [],
              icon: node.icon ? node.icon : 'Menu',
              index: node.id ? node.id : '',
              name: node.title ? node.title : '未命名',
              parentId: node.parent ? node.parent : undefined,
              type: 'material'
            };
            materialNodeTreeList.value?.push(new MaterialTreeModel(params));
          }
        });
        resolve('插入物料节点成功');
      }
    } catch (e) {
      console.error('插入物料节点失败', e);
      reject('插入物料节点失败');
    }
  });
}
// TODO: 适配撤销&反做事件

/**
 * @description 初始化物料节点树
 */
async function initMaterialNodeTree(schema: MaterialDocumentModel | undefined): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      if (schema) {
        if (!$util.renren.isEmpty(schema)) {
          // 同步 document 节点
          await createDocumentNode(schema).catch(err => reject(err));

          if (schema?.nodes) {
            // 将 schema.nodes 转换为 Map，便于查找
            const newNodeMap = new Map<string, RenrenMaterialModel>();
            schema.nodes.forEach(node => newNodeMap.set(node.title, new RenrenMaterialModel(node)));

            // 删除不存在的节点
            materialNodeTreeList.value = materialNodeTreeList.value.filter(node =>
              node.name === schema.fileName || newNodeMap.has(node.name)
            );

            // 插入或更新节点
            await insertMaterialNode(schema.nodes as RenrenMaterialModel[]).catch(err => reject(err));
          }
          resolve('初始化物料节点树成功');
        } else {
          reject('未找到物料文档');
        }
      }
    } catch (e) {
      console.error('初始化物料节点树失败', e);
      reject('初始化物料节点树失败');
    }
  });
}


onMounted(async () => {
  // 获取 schema
  const schema: MaterialDocumentModel | void = await $engine.arrangement.getSchema();
  // 初始化物料节点
  await initMaterialNodeTree(schema).catch(err => {
    $message({
      type: 'warning',
      message: err
    });
  });
});


/**
 * @description 刷新物料节点树
 */
function refreshTree(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const schema: MaterialDocumentModel | void = await $engine.arrangement.getSchema();
      if (schema) {
        await insertMaterialNode(schema.nodes as RenrenMaterialModel[]).then(() => {
          resolve('刷新物料节点树成功');
        }).catch(err => {
          $message({
            type: 'warning',
            message: err
          });
        });
      }
    } catch (e) {
      console.error('刷新物料节点树失败', e);
      reject('刷新物料节点树失败');
    }
  });
}


/**
 * @description 清空节点树
 */
function clearTreeNode(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // 获取 schema
      const schema: MaterialDocumentModel | void = await $engine.arrangement.getSchema();
      // 去除除了 document 节点外的其他所有节点
      materialNodeTreeList.value = materialNodeTreeList.value.filter(node => node.name === schema?.fileName);
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
  const documentNode: MaterialDocumentModel | undefined = await $engine.arrangement.getSchema();
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
    $engine.arrangement.editDocumentTitle(documentNodeName.value).then(async () => {
      // 更新 tree list 中 document node 的名称
      let documentNode: MaterialTreeModel | undefined = materialNodeTreeList.value[0];
      if (documentNode !== void 0 && documentNode?.name) {
        documentNode.name = documentNodeName.value ? documentNodeName.value : '未知节点';
        materialNodeTreeList.value[0] = documentNode;
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
  await refreshTree().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
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
</script>

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
           @click="refreshTree"
           size="15"
           class="cursor-pointer"
         >
           <Refresh />
         </el-icon>
       </el-tooltip>
     </div>
     <NodeTreeItem
       v-for="(item, index) in materialNodeTreeList"
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
