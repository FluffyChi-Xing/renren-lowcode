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
import MaterialNodeTree from "@/pages/workerspace/_components/MaterialNodeTree.vue";
import {$engine} from "@/renren-engine/engine";
import HighLightLang from "@/components/HighLightLang.vue";




const isMaterialCollapse = ref<boolean>(false)
const isEditConfigCollapse = ref<boolean>(false)
const defaultIndex = ref<string>('1');
const defaultMaterial = ref(BaseMaterial);
const clearCanvasFlag = ref<boolean>(false); // 清空画布标识
const showDrawer = ref<boolean>(false);
const schema2String = ref<string>();


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
 * @description 处理高亮 schema 事件
 */
async function showSchemaHandler() {
  showDrawer.value = !showDrawer.value;
  const schema = await $engine.getSchema();
  const isEmpty: boolean = Object.keys(schema).length === 0 && schema.constructor === Object;
  if (!isEmpty) {
    schema2String.value = JSON.stringify(schema, null, 2);
    // console.log(schema2String.value);
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
            <template #pageTree>
              <MaterialNodeTree
                v-if="!isMaterialCollapse"
              />
            </template>
          </MaterialAside>
        </el-aside>
        <el-main>
          <!-- canvas -->
          <Canvas v-model:clear-flag="clearCanvasFlag" />
          <!-- schema drawer -->
          <el-drawer
            v-model="showDrawer"
            style="width: 300px;"
            direction="rtl"
            :show-close="false"
            :close-on-click-modal="false"
          >
            <template #header>
              <div class="w-full h-auto flex items-center justify-between">
                <!-- title -->
                <span class="font-bold text-black">Schema</span>
                <!-- btns -->
                <div class="w-auto h-auto flex">
                  <el-button type="primary" plain>导出</el-button>
                  <el-button @click="showDrawer = false" type="info">关闭</el-button>
                </div>
              </div>
            </template>
            <template #default>
              <div class="w-full h-full flex flex-col">
                <!-- highlight-block -->
                <HighLightLang
                  :code="schema2String"
                  lang="json"
                />
              </div>
            </template>
          </el-drawer>
        </el-main>
        <el-aside :width="isEditConfigCollapse ? '150px' : '350px'">
          <EditorConfiguration
            @collapse="editorConfigCollapseHandler"
          >
            <template #side>
              <EditorSideBar
                @clear="clearCanvasHandler"
                @schema="showSchemaHandler"
              />
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
