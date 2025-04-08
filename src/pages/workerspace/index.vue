<script setup lang="ts">
import WorkerSpaceHeader from "@/pages/workerspace/_components/WorkerSpaceHeader.vue";
import MaterialAside from "@/pages/workerspace/_components/MaterialAside.vue";
import EditorConfiguration from "@/pages/workerspace/_components/EditorConfiguration.vue";
import Canvas from "@/pages/workerspace/_components/Canvas.vue";
import {onMounted, ref} from "vue";
import MaterialTab from "@/pages/workerspace/_components/MaterialTab.vue";
import EditorSideBar from "@/pages/workerspace/_components/EditorSideBar.vue";
import BaseMaterial from "@/components/material/BaseMaterial.vue";
import {ElEmpty} from "element-plus";
import {initSchema} from "@/renren-engine/arrangement/arrangement";
import {$message} from "@/componsables/element-plus";




const isMaterialCollapse = ref<boolean>(false)
const isEditConfigCollapse = ref<boolean>(false)
const defaultIndex = ref<string>('1');
const defaultMaterial = ref(BaseMaterial);
const clearCanvasFlag = ref<boolean>(false); // 清空画布标识


/**
 * @description 处理物料栏折叠事件
 * @param index
 */
function materialCollapseHandler(index: boolean) {
  isMaterialCollapse.value = index;
}


/**
 * @description 处理属性编辑器栏折叠事件
 * @param index
 */
function editorConfigCollapseHandler(index: boolean) {
  isEditConfigCollapse.value = index;
}


/**
 * @description 处理画布清空事件
 */
function clearCanvasHandler() {
  clearCanvasFlag.value = !clearCanvasFlag.value;
}


/**
 * @description 处理tab栏切换事件
 * @param index
 */
function tabChangeHandler(index: string) {
  if (index) {
    switch (index) {
      case '1':
        defaultMaterial.value = BaseMaterial;
        break;
      default:
        defaultMaterial.value = ElEmpty as any;
        break;
    }
  }
}


/**
 * @description 初始化 schema
 */
onMounted(async () => {
  await initSchema().catch((err: string) => {
    $message({
      type: 'warning',
      message: err,
    });
  });
});
</script>

<template>
  <div class="w-full h-full flex flex-col bg-main-background">
    <el-container>
      <el-header>
        <WorkerSpaceHeader />
      </el-header>
      <el-container>
        <el-aside :width="isMaterialCollapse ? '80px' : '250px'">
          <MaterialAside
            @collapse="materialCollapseHandler"
          >
            <template #component>
              <MaterialTab
                v-if="!isMaterialCollapse"
                @change="tabChangeHandler"
                :pane-comp="defaultMaterial"
              />
            </template>
          </MaterialAside>
        </el-aside>
        <el-main>
          <Canvas v-model:clear-flag="clearCanvasFlag" />
        </el-main>
        <el-aside :width="isEditConfigCollapse ? '150px' : '350px'">
          <EditorConfiguration
            @collapse="editorConfigCollapseHandler"
          >
            <template #side>
              <EditorSideBar @clear="clearCanvasHandler" />
            </template>
          </EditorConfiguration>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
:deep(.el-header) {
  padding: 0;
}

:deep(.el-aside) {
  padding: 0;
}
</style>
