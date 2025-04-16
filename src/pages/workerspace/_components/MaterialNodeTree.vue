<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {MaterialDocumentModel, MaterialTreeModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$engine} from "@/renren-engine/engine";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";
import {$message} from "@/componsables/element-plus";
import NodeTreeItem from "@/pages/workerspace/_components/NodeTree/NodeTreeItem.vue";
import {useCanvasStore} from "@/stores/canvas";
import {Refresh} from "@element-plus/icons-vue";





const materialNodeTreeList = ref<MaterialTreeModel[]>([]);
const canvasStore = useCanvasStore();


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
          parentId: undefined
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
      if (nodes) {
        if (nodes?.length > 0) {
          nodes?.forEach((node: RenrenMaterialModel) => {
            const existingNode = materialNodeTreeList.value?.find(n => n.name === node.title && n.index === node.id);
            if (!existingNode) {
              let params: MaterialInterface.MaterialTreeType = {
                children: [],
                icon: node.icon ? node.icon : 'Menu',
                index: node.id ? node.id : generateUUID(),
                name: node.title ? node.title : '未命名',
                parentId: node.parent ? node.parent : undefined,
              };
              materialNodeTreeList.value?.push(new MaterialTreeModel(params));
            } else {
              // 更新现有节点（可选）
              existingNode.icon = node.icon || 'Menu';
              existingNode.parentId = node.parent || 0;
            }
          });
          resolve('插入物料节点成功');
        }
      }
    } catch (e) {
      console.error('插入物料节点失败', e);
      reject('插入物料节点失败');
    }
  });
}


/**
 * @description 初始化物料节点树
 */
async function initMaterialNodeTree(schema: MaterialDocumentModel | undefined): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      if (schema) {
        const isEmpty: boolean = Object.keys(schema).length === 0 && schema.constructor === Object;
        if (!isEmpty) {
          // 同步 document 节点
          if (!materialNodeTreeList.value.some(node => node.name === schema.fileName)) {
            await createDocumentNode(schema).catch(err => reject(err));
          }

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
  const schema: MaterialDocumentModel | void = await $engine.getSchema();
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
      const schema: MaterialDocumentModel | void = await $engine.getSchema();
      // console.log(schema);
      if (schema) {
        await initMaterialNodeTree(schema).catch(err => {
          $message({
            type: 'warning',
            message: err
          });
        });
        resolve('刷新物料节点树成功');
      }
    } catch (e) {
      console.error('刷新物料节点树失败', e);
      reject('刷新物料节点树失败');
    }
  });
}


/**
 * @description 自动更新物料节点树
 */
watch(() => canvasStore.isAdd, async (newVal: string) => {
  if (newVal !== '000') {
    await refreshTree().catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
  }
});
</script>

<template>
  <!-- 物料节点树 -->
  <div class="w-full h-full flex flex-col">
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
    />
  </div>
</template>

<style scoped>

</style>
