<script setup lang="ts">
import { ref } from 'vue';
import $event from "@/componsables/utils/EventBusUtil";
import AnimationTabPane from "@/pages/workerspace/_components/Attributes/_components/AnimationTabPane.vue";
import { $engine } from "@/renren-engine/engine";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {mySchemaStore} from "@/stores/schema";
import {$message} from "@/componsables/element-plus";
import '@/assets/animation.css';
import {$util} from "@/componsables/utils";
import CoreEngine from "@/renren-engine";





const isShow = ref<boolean>(false);
const engine = new CoreEngine();
/**
 * @description 处理动画绑定事件
 * @param item
 */
function addAnimationHandler(item: RenrenInterface.keyValueType<string>): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // 将动画保存到 store 中
      await $util.renren.isMaterial(mySchemaStore.currentElement, async () => {
        const material: RenrenMaterialModel = mySchemaStore.currentElement as RenrenMaterialModel;
        if (material.animation && material.animation.length > 0) {
          $message({
            type: 'warning',
            message: '每个物料只能绑定一种动画'
          });
          reject('每个物料只能绑定一种动画');
        } else {
          material.animation?.push(item);
          mySchemaStore.currentElement = material;
        }
        // 将动画保存在 schema 中
        await engine.renderer.insertAnimation(material.id, item).catch(err => {
          reject(err as string);
        });
        resolve('保存动画成功');
      });
      isShow.value = false;
    } catch (e) {
      console.error('同步动画到 store 失败', e);
      isShow.value = false;
      reject('同步动画到 store 失败');
    }
  });
}


$event.on('addAnimation', () => {
  isShow.value = true;
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
        <span class="font-bold text-black">动画效果</span>
        <!-- btns -->
        <div class="w-auto h-auto flex">
          <el-button @click="isShow = false" type="text" icon="close">关闭</el-button>
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
</template>

<style scoped>

</style>
