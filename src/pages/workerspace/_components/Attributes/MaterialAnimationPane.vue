<script setup lang="ts">
import $event from "@/componsables/utils/EventBusUtil";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {onMounted, ref} from 'vue';
import {$util} from "@/componsables/utils";
import tableHeader from './attribute-table-header-style.json';
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {mySchemaStore} from "@/stores/schema";
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";




const engine = container.resolve<IEngine>('engine');
const animationList = ref<RenrenInterface.keyValueType<string>[]>([]);

/**
 * @description 添加动画事件
 */
function addAnimation2MaterialHandler() {
  $event.emit('addAnimation');
}


/**
 * @description 处理物料动画预览事件
 */
function previewMaterialAnimationHandler() {
  if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
    const material = mySchemaStore.currentElement as RenrenMaterialModel;
    $event.emit(`previewAnimation:${material.id}`);
  }
}


/**
 * @description 添加动画效果信息到列表中
 */
function addAnimationInfo2List() {
  if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
    const material = mySchemaStore.currentElement as RenrenMaterialModel;
    if (material !== void 0) {
      if (material.animation && material.animation.length > 0) {
        material.animation.forEach(item => {
          animationList.value.push(item);
        });
      }
    }
  }
}


/**
 * @description 删除动画效果
 * @param key
 */
function removeAnimationBinding(key?: string): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // 清空对应组件的 animation 属性
      let component: MaterialInterface.IMaterial | undefined;
      component = engine.arrangement.getComponent((mySchemaStore.currentElement as RenrenMaterialModel)?.id);
      if (component !== void 0) {
        if (Array.isArray(component.animation) && component.animation.length >= 0) {
          component.animation = [];
          await engine.arrangement.updateComponent(component);
        }
      }
      // 清空 schemaStore.currentElement.animation
      if ($util.renren.isMaterial(mySchemaStore.currentElement)) {
        const material = mySchemaStore.currentElement as RenrenMaterialModel;
        if (material.animation && material.animation.length > 0) {
          material.animation = [];
          mySchemaStore.currentElement = material;
        }
      }
      // 清空 animationList
      animationList.value = [];
      resolve('删除动画效果成功');
    } catch (e) {
      console.error('删除动画效果失败', e);
      reject('删除动画效果失败');
    }
  });
}



$event.on('animationAdded', () => {
  addAnimationInfo2List();
});



onMounted(() => {
  addAnimationInfo2List();
});
</script>

<template>
  <div class="w-full h-auto flex flex-col">
    <!-- action-banner -->
    <div class="w-full h-auto flex items-center justify-center">
      <el-button @click="addAnimation2MaterialHandler">添加动画</el-button>
      <el-button @click="previewMaterialAnimationHandler">预览动画</el-button>
    </div>
    <!-- animation-list-table -->
    <div
      v-if="animationList.length > 0"
      class="w-full h-auto flex mt-4"
    >
      <el-table
        :data="animationList"
        stripe
        border
        fit
        :header-cell-style="tableHeader"
      >
        <el-table-column
          label="动画名称"
          prop="key"
        />
        <el-table-column
          label="动画类名"
          prop="value"
        />
        <el-table-column
          label="操作"
          :fixed="'right'"
        >
          <template #default="{ row }">
            <div class="w-full h-auto flex items-center justify-center">
              <el-button @click="removeAnimationBinding" size="small" type="text">删除动画</el-button>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无动画效果" />
        </template>
      </el-table>
    </div>
  </div>
</template>

<style scoped>

</style>
