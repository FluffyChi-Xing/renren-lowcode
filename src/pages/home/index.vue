<script setup lang="ts">
import {onMounted, ref} from "vue";
import Draggable from "@/components/Draggable.vue";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";
import {useSchemaStore} from "@/stores/schema";
import {createSchema, deleteNode, getSchema, insertNode2Document} from "@/renren-engine/arrangement/arrangement";
import {$message} from "@/componsables/element-plus";
const schemaStore = useSchemaStore();



const list1 = ref<RenrenMaterialModel[]>([
  new RenrenMaterialModel({
    id: generateUUID(),
    isLocked: false,
    hidden: true,
    isNode: true,
    condition: '1',
    conditionGroup: '1',
    title: '测试组件1',
    zLevel: 0,
    children: [],
    parent: null,
    props: null,
    icon: ''
  }),
  new RenrenMaterialModel({
    id: generateUUID(),
    isLocked: false,
    hidden: true,
    isNode: true,
    condition: '1',
    conditionGroup: '1',
    title: '测试组件2',
    zLevel: 0,
    children: [],
    parent: null,
    props: null,
    icon: ''
  }),
]);
const list2 = ref<RenrenMaterialModel[]>([]);

async function handleUpdate(index: any) {
  // console.log(index);
  // schemaStore.schema.nodes.push(index);
  await insertNode2Document(index).catch(err => {
    $message({
      type: 'warning',
      message: err,
    });
  });
}


function deleteNodeHandler(index: string) {
  list2.value = list2.value.filter(item => item.id !== index);
  deleteNode(index).catch(err => {
    $message({
       type: 'warning',
       message: err,
    });
  });
}


onMounted(async () =>{
  const schema: MaterialDocumentModel = await getSchema();
  if (schema.nodes) {
    schema.nodes.forEach(item => {
      list2.value.push(new RenrenMaterialModel(item));
    });
  }
  if (!schema) {
    await createSchema().catch(err => {
      $message({
        type: 'warning',
        message: err,
      });
    });
  }
})
</script>

<template>
  <!-- 测试拖拽 -->
  <div class="w-full h-full grid grid-cols-3 gap-4 p-4">
    <div class="w-full h-full flex flex-col bg-red-500 p-4">
      <Draggable
        v-model:model-value="list1"
        :group="{ name: 'test', pull: 'clone', put: false }"
        :sort="false"
        class="w-full h-full"
      >
        <div
          v-for="(item, index) in list1"
          :key="index"
          class="w-full h-10 flex items-center px-4 justify-center text-white mb-4 bg-yellow-500"
        >
          {{ item.title }}
        </div>
      </Draggable>
    </div>
    <div class="w-full h-full flex flex-col bg-red-500 p-4">
      <Draggable
        v-model:model-value="list2"
        :sort="false"
        group="test"
        class="w-full h-full"
        @update="handleUpdate"
      >
        <div
          v-for="(item, index) in list2"
          :key="index"
          class="w-full h-10 flex items-center px-4 justify-center text-white mb-4 bg-yellow-500"
        >
          {{ item.title }}
          <el-button @click="deleteNodeHandler(item.id)" class="ml-auto" type="danger" plain>删除</el-button>
        </div>
      </Draggable>
    </div>
    <div class="w-full h-full flex flex-col bg-red-500">

    </div>
  </div>
</template>

<style scoped>

</style>
