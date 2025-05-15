<script setup lang="ts">
import WorkerSpaceHeader from "@/pages/workerspace/_components/WorkerSpaceHeader.vue";
import MaterialAside from "@/pages/workerspace/_components/MaterialAside.vue";
import EditorConfiguration from "@/pages/workerspace/_components/EditorConfiguration.vue";
import Canvas from "@/pages/workerspace/_components/Canvas.vue";
import {onMounted, ref} from "vue";
import MaterialTab from "@/pages/workerspace/_components/MaterialTab.vue";
import EditorSideBar from "@/pages/workerspace/_components/EditorSideBar.vue";
import {initSchema} from "@/renren-engine/modules/arrangement/arrangement";
import {$message} from "@/componsables/element-plus";
import MaterialNodeTree from "@/pages/workerspace/_components/MaterialNodeTree.vue";
import AttributesPane from "@/pages/workerspace/_components/AttributesPane.vue";
import '@/assets/animation.css';
import ViewSchemaDrawer from "@/pages/workerspace/_components/drawer/ViewSchemaDrawer.vue";
import AddAnimationDrawer from "@/pages/workerspace/_components/drawer/AddAnimationDrawer.vue";
import AddEventDrawer from "@/pages/workerspace/_components/drawer/AddEventDrawer.vue";




const isMaterialCollapse = ref<boolean>(false);
const isEditConfigCollapse = ref<boolean>(false);
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
              />
            </template>
            <template #pageTree>
              <MaterialNodeTree
                v-if="!isMaterialCollapse"
              />
            </template>
          </MaterialAside>
        </el-aside>
        <el-main>
          <!-- canvas -->
          <Canvas />
          <!-- schema drawer -->
          <ViewSchemaDrawer />
          <!-- material-animation-drawer -->
          <AddAnimationDrawer />
          <!-- event-drawer -->
          <AddEventDrawer />
        </el-main>
        <el-aside :width="isEditConfigCollapse ? '150px' : '350px'">
          <EditorConfiguration
            @collapse="editorConfigCollapseHandler"
          >
            <template #attributes>
              <AttributesPane />
            </template>
            <template #side>
              <EditorSideBar />
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

:deep(.el-main) {
  padding: 0;
}
</style>
