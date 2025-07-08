<script setup lang="ts">
import {ref, watch} from 'vue';
import EventTabPane from "@/pages/workerspace/_components/Attributes/_components/EventTabPane.vue";
import $event from "@/componsables/utils/EventBusUtil";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {mySchemaStore} from "@/stores/schema";



const isShow = ref<boolean>(false);

$event.on('bindEvent', () => {
  isShow.value = false;
});

watch(() => mySchemaStore.getCurrentElement, () => {
  $event.on(`addEvent:${(mySchemaStore.getCurrentElement as RenrenMaterialModel)?.id}`, () => {
    isShow.value = true;
  });
}, {
  deep: true,
});
</script>

<template>
  <el-drawer
    v-model="isShow"
    size="350"
    direction="ltr"
    :show-close="false"
    :close-on-click-modal="false"
  >
    <template #header>
      <div class="w-full h-auto flex items-center justify-between">
        <!-- title -->
        <span class="font-bold text-black">事件绑定</span>
        <!-- btns -->
        <div class="w-auto h-auto flex">
          <el-button @click="isShow = false" type="text" icon="close">关闭</el-button>
        </div>
      </div>
    </template>
    <template #default>
      <el-scrollbar height="600">
        <EventTabPane />
      </el-scrollbar>
    </template>
  </el-drawer>
</template>

<style scoped>

</style>
