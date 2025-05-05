<script setup lang="ts">
import WorkerSpaceHeader from "@/pages/workerspace/_components/WorkerSpaceHeader.vue";
import MaterialAside from "@/pages/workerspace/_components/MaterialAside.vue";
import EditorConfiguration from "@/pages/workerspace/_components/EditorConfiguration.vue";
import Canvas from "@/pages/workerspace/_components/Canvas.vue";
import {onMounted, ref, watch} from "vue";
import type { Component } from "vue";
import MaterialTab from "@/pages/workerspace/_components/MaterialTab.vue";
import EditorSideBar from "@/pages/workerspace/_components/EditorSideBar.vue";
import {initSchema} from "@/renren-engine/modules/arrangement/arrangement";
import {$message} from "@/componsables/element-plus";
import MaterialNodeTree from "@/pages/workerspace/_components/MaterialNodeTree.vue";
import {$engine} from "@/renren-engine/engine";
import HighLightLang from "@/components/HighLightLang.vue";
import AttributesPane from "@/pages/workerspace/_components/AttributesPane.vue";
import {useSchemaStore} from "@/stores/schema";
import $event from "@/componsables/utils/EventBusUtil";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import AnimationTabPane from "@/pages/workerspace/_components/Attributes/_components/AnimationTabPane.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import EventTabPane from "@/pages/workerspace/_components/Attributes/_components/EventTabPane.vue";
import BaseDialog from "@/components/BaseDialog.vue";
import {useCanvasStore} from "@/stores/canvas";
import '@/assets/animation.css';




const isMaterialCollapse = ref<boolean>(false);
const isEditConfigCollapse = ref<boolean>(false);
const showDrawer = ref<boolean>(false);
const animateDrawer = ref<boolean>(false); // 动画抽屉标识
const eventDrawer = ref<boolean>(false); // 事件属性抽屉标识
const schema2String = ref<string>();
const schemaStore = useSchemaStore();
const canvasStore = useCanvasStore();
const previewFlag = ref<boolean>(false);
const pageElement = ref<Component[]>([]);
const isLoading = ref<boolean>(false);


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
 * @description 处理高亮 schema 事件
 */
async function showSchemaHandler() {
  showDrawer.value = !showDrawer.value;
  const schema = await $engine.arrangement.getSchema();
  const isEmpty: boolean = Object.keys(schema).length === 0 && schema.constructor === Object;
  if (!isEmpty) {
    schema2String.value = JSON.stringify(schema, null, 2);
  }
}


/**
 * @description 处理动画绑定事件
 * @param item
 */
function addAnimationHandler(item: RenrenInterface.keyValueType<string>): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // 将动画保存到 store 中
      if (schemaStore.currentElement?.type === 'material') {
        const material: RenrenMaterialModel = schemaStore.currentElement as RenrenMaterialModel;
        if (material.animation && material.animation.length > 0) {
         $message({
           type: 'warning',
           message: '每个物料只能绑定一种动画'
         });
         reject('每个物料只能绑定一种动画');
        } else {
          material.animation?.push(item);
          schemaStore.currentElement = material;
        }
        // 将动画保存在 schema 中
        await $engine.arrangement.insertAnimation2Material(material.id, item).catch(err => {
          reject(err as string);
        });
        resolve('保存动画成功');
      }
    } catch (e) {
      console.error('同步动画到 store 失败', e);
      reject('同步动画到 store 失败');
    }
  });
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


watch(() => schemaStore.currentElement, () => {
  const material = schemaStore.currentElement;
  if (material !== void 0) {
    if (material?.type === 'material') {
      // 处理添加动画绑定事件
      $event.on(`addAnimation:${(schemaStore.currentElement as RenrenMaterialModel)?.id}`, () => {
        animateDrawer.value = true;
      });
      // 处理事件绑定事件
      $event.on(`addEvent:${(schemaStore.currentElement as RenrenMaterialModel)?.id}`, () => {
        eventDrawer.value = true;
      });
    }
  }
}, {
  deep: true
});



$event.on('addAnimation', () => {
  animateDrawer.value = false;
});

$event.on('bindEvent', () => {
  eventDrawer.value = false;
});



$event.on('previewPage', () => {
  previewFlag.value = true;
  isLoading.value = true;
  $engine.renderer.previewRenderingPage().then((res: Component[]) => {
    pageElement.value = res;
    // TODO: 绑定动画
    // TODO: 绑定事件
    isLoading.value = false;
  }).catch(() => {
    isLoading.value = false;
    $message({
      type: 'warning',
      message: '预览失败,请稍后'
    });
  });
  isLoading.value = false;
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
          <!-- material-animation-drawer -->
          <el-drawer
            v-model="animateDrawer"
            size="350"
            direction="ltr"
            :show-close="false"
            :close-on-click-modal="false"
          >
            <template #header>
              <div class="w-full h-auto flex items-center justify-between">
                <!-- title -->
                <span class="font-bold text-black">动画效果</span>
                <!-- btns -->
                <div class="w-auto h-auto flex">
                  <el-button @click="animateDrawer = false" type="text" icon="close">关闭</el-button>
                </div>
              </div>
            </template>
            <template #default>
              <div class="w-full h-full flex flex-col">
                <el-scrollbar height="600">
                  <AnimationTabPane @add-animate="addAnimationHandler" />
                </el-scrollbar>
              </div>
            </template>
          </el-drawer>
          <!-- event-drawer -->
          <el-drawer
            v-model="eventDrawer"
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
                  <el-button @click="eventDrawer = false" type="text" icon="close">关闭</el-button>
                </div>
              </div>
            </template>
            <template #default>
              <el-scrollbar height="600">
                <EventTabPane />
              </el-scrollbar>
            </template>
          </el-drawer>
        </el-main>
        <el-aside :width="isEditConfigCollapse ? '150px' : '350px'">
          <EditorConfiguration
            @collapse="editorConfigCollapseHandler"
          >
            <template #attributes>
              <AttributesPane />
            </template>
            <template #side>
              <EditorSideBar
                @schema="showSchemaHandler"
              />
            </template>
          </EditorConfiguration>
        </el-aside>
      </el-container>
    </el-container>
    <!-- preview-whole-page -->
    <BaseDialog
      v-model:show="previewFlag"
      title="预览页面"
      :width="canvasStore.width"
      :footer="true"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <template #default>
        <div
          v-loading="isLoading"
          class="w-full h-auto flex"
          :style="{ height: canvasStore.height + 'px', backgroundColor: canvasStore.canvasColor }"
        >
          <component
            v-for="(item, index) in pageElement"
            :key="index"
            :is="item"
          />
        </div>
      </template>
      <template #footer>
        <div class="w-full h-auto flex items-center justify-end">
          <el-button type="primary">确认</el-button>
          <el-button @click="() => previewFlag = false" type="info">取消</el-button>
        </div>
      </template>
    </BaseDialog>
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
