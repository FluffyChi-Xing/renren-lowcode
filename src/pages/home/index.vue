<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Component} from "vue";
import Draggable from "@/components/Draggable.vue";
import {MaterialDocumentModel, RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {useSchemaStore} from "@/stores/schema";
import {createSchema, deleteNode, getSchema, insertNode2Document} from "@/renren-engine/arrangement/arrangement";
import {$message} from "@/componsables/element-plus";
import {createMaterialElement} from "@/renren-engine/renderer/renderer";
import {buttonSchema} from "@/material/base/Button";
import MaterialItem from "@/components/MaterialItem.vue";
const schemaStore = useSchemaStore();



const list1 = ref<RenrenMaterialModel[]>([
  new RenrenMaterialModel(buttonSchema)
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


function deleteNodeHandler(index: string, e?: MouseEvent) {
  e?.stopPropagation();
  e?.preventDefault();
  list2.value = list2.value.filter(item => item.id !== index);
  deleteNode(index).catch(err => {
    $message({
       type: 'warning',
       message: err,
    });
  });
}

const comp = ref<Component>();

onMounted(async () =>{
  const schema: MaterialDocumentModel = await getSchema();
  // await createSchema().catch(err => {
  //   $message({
  //     type: 'warning',
  //     message: err,
  //   });
  // });
  if (!schema) {
    await createSchema().catch(err => {
      $message({
        type: 'warning',
        message: err,
      });
    });
  }
  if (schema.nodes) {
    schema.nodes.forEach(item => {
      list2.value.push(new RenrenMaterialModel(item));
    });
  }
  comp.value = await createMaterialElement(new RenrenMaterialModel(buttonSchema)) as Component;
  // console.log(comp.value);
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
        <div class="w-full h-full grid grid-cols-3 gap-4">
          <MaterialItem
            v-for="(item, index) in list1"
            :key="index"
            :item="item"
          />
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
        <div class="w-full h-full grid grid-cols-3 gap-4">
          <MaterialItem
            v-for="(item, index) in list2"
            :key="index"
            :item="item"
            @dblclick="deleteNodeHandler(item.id)"
          />
        </div>
      </Draggable>
    </div>
    <div class="w-full h-full flex flex-col bg-red-500 p-4">
      <!-- 测试物料->组件渲染 -->
      <component :is="comp" />
    </div>
  </div>
</template>

<style scoped>

</style>
