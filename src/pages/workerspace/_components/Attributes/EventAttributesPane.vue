<script setup lang="ts">
import {onMounted, ref} from 'vue';
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {eventNameValueMap} from "@/componsables/utils/EventAttrUtil";
import $event from "@/componsables/utils/EventBusUtil";
import {useSchemaStore} from "@/stores/schema";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$util} from "@/componsables/utils";





const schemaStore = useSchemaStore();
/** ===== 事件绑定-start =====**/
const eventData = ref<RenrenInterface.IEvent[]>([]);


/**
 * @description 事件绑定
 */
function addEventHandler() {
  if ($util.store.isCurrentElementAMaterial()) {
    const material = schemaStore.currentElement as RenrenMaterialModel;
    if (material) {
      $event.emit(`addEvent:${material.id}`);
    }
  }
}


/**
 * @description 清空事件绑定
 */
function clearEventsHandler() {
  if ($util.store.isCurrentElementAMaterial()) {
    const material = schemaStore.currentElement as RenrenMaterialModel;
    if (material) {
      $event.emit(`clearEvent:${material.id}`);
      /**
       * TODO: 清空 schema 中对应 material 的 events
       * TODO: 清空 schemaStore.currentElement.events
       */
    }
  }
}


function initEventData() {
  if ($util.store.isCurrentElementAMaterial()) {
    const material = schemaStore.currentElement as RenrenMaterialModel;
    if (material && material.events) {
      eventData.value = material.events as RenrenInterface.IEvent[];
      // console.log(eventData.value);
    }
  }
}


$event.on('bindEvent', () => {
  initEventData();
});


onMounted(() => {
  initEventData();
});
/** ===== 事件绑定-end =====**/
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <!-- functional-banner -->
    <div class="w-full h-auto flex items-center justify-center">
      <el-button @click="addEventHandler">添加事件</el-button>
      <el-button @click="clearEventsHandler">清空事件</el-button>
    </div>
    <!-- event-attributes-list -->
    <div
      v-if="eventData?.length > 0"
      class="w-full h-auto flex mt-4 flex-col"
    >
      <el-table
        :data="eventData"
        fit
        stripe
        border
        :header-cell-style="{ backgroundColor: '#5ea0ff', alignItems: 'center', color: '#000' }"
      >
        <el-table-column
          label="事件id"
          prop="id"
        />
        <el-table-column
          label="事件名称"
          prop="name"
        />
        <el-table-column
          label="事件类型"
          prop="type"
        />
        <el-table-column
          label="操作"
          :fixed="'right'"
        >
          <template #default="{ row }">
            <div class="w-full h-auto flex items-center justify-center">
              <el-button type="text" size="small">移除事件</el-button>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无事件绑定" />
        </template>
      </el-table>
    </div>
  </div>
</template>

<style scoped>

</style>
