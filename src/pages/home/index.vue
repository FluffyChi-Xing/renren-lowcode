<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Component} from "vue";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {useSchemaStore} from "@/stores/schema";
import {
  createSchema,
  deleteNode,
  getSchema,
  updateSchema
} from "@/renren-engine/arrangement/arrangement";
import {$message} from "@/componsables/element-plus";
import {createMaterialElement} from "@/renren-engine/renderer/renderer";
import {buttonSchema} from "@/material/base/Button";
import MaterialItem from "@/components/MaterialItem.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import {getCursorPosition} from "@/componsables/utils/CanvasUtil";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import DisplayItem from "@/components/DisplayItem.vue";
const schemaStore = useSchemaStore();
const showDialog = ref<boolean>(false);



const list1 = ref<RenrenMaterialModel[]>([
  new RenrenMaterialModel(buttonSchema)
]);
const list2 = ref<RenrenMaterialModel[]>([]);
const container = ref();


async function deleteNodeHandler(index: string) {
  // console.log(index);
  list2.value = list2.value.filter(item => item.id !== index);
  await deleteNode(index).catch(err => {
    $message({
       type: 'warning',
       message: err,
    });
  });
}

const comp = ref<Component>();

onMounted(async () =>{
  const schema: MaterialDocumentModel = await getSchema();
  if (!schema) {
    await createSchema().catch(err => {
      $message({
        type: 'warning',
        message: err,
      });
    });
  }
  if (schema.nodes) {
    // schema.nodes = [];
    // await updateSchema(schema);
    schema.nodes.forEach(item => {
      list2.value.push(new RenrenMaterialModel(item));
    });
  }
  comp.value = await createMaterialElement(new RenrenMaterialModel(buttonSchema)) as Component;
})


/**
 * @description 保存当前选中的组件
 * @param e
 * @param item
 */
function selectCurrent(e: MouseEvent, item: RenrenMaterialModel) {
  e.preventDefault();
  if (item) {
    showDialog.value = true;
    schemaStore.initCurrent(item);
  }
}
function handleDrag(event: DragEvent, item: RenrenMaterialModel) {
  event.dataTransfer?.setData('material', JSON.stringify(item));
}


async function handleMousedown(e: MouseEvent | undefined) {
  if (container.value) {
    await getCursorPosition(e, container.value, 500);
  }
}


async function handleDropEvent(e: DragEvent) {
  const item: RenrenMaterialModel = JSON.parse(e.dataTransfer?.getData('material') || '{}');
  // console.log('drop', item);
  // 向 item 中添加当前的坐标位置
  let position = {
    x: 0,
    y: 0,
  };
  if (container.value) {
    position = await getCursorPosition(e, container.value, 500);
  }
  const prop: MaterialInterface.IProp = {
    code: "",
    items: null,
    key: "style",
    maps: undefined,
    owner: null,
    parent: undefined,
    type: "",
    value: `left: ${position.x}px;top: ${position.y}px;`
  };
  item.props?.items?.push(prop);
  // 注册 item 到 list2 & schema
  const newItem = new RenrenMaterialModel(item);
  list2.value.push(newItem);
  const schema = await getSchema();
  schema.nodes?.push(newItem);
  await updateSchema(schema);
}

function handleDragover(e: DragEvent) {
  e.preventDefault(); // 阻止默认行为，允许放置数据
}
</script>

<template>
  <!-- 测试拖拽 -->
  <div class="w-full h-full grid grid-cols-3 gap-4 p-4">
    <div class="w-full h-full flex flex-col bg-red-500 p-4">
      <div class="w-full h-full grid grid-cols-3 gap-4">
        <MaterialItem
          v-for="(item, index) in list1"
          :key="index"
          :item="item"
          @start="handleDrag($event, item)"
        />
      </div>
    </div>
    <div class="w-full h-full flex flex-col bg-red-500">
      <div
        ref="container"
        @mousemove="handleMousedown"
        @drop="handleDropEvent"
        @dragover="handleDragover"
        class="w-full h-full block p-4 relative overflow-hidden"
      >
        <DisplayItem
          v-for="(item, index) in list2"
          :key="index"
          :item="item"
          @click.right="selectCurrent($event, item)"
          @dblclick="deleteNodeHandler(item.id)"
        />
      </div>
    </div>
    <div class="w-full h-full flex flex-col bg-red-500 p-4">
      <!-- 测试物料->组件渲染 -->
      <component :is="comp" />
    </div>
    <!-- dialog -->
    <BaseDialog
      v-model:show="showDialog"
      title="属性同步"
      :show-close="false"
      :close-on-click-modal="false"
      :footer="true"
    >
      <template #footer>
        <div class="w-full h-auto flex items-center justify-end">
          <el-button type="primary" @click="showDialog = false">关闭</el-button>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<style scoped>

</style>
