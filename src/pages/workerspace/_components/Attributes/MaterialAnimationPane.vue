<script setup lang="ts">
import $event from "@/componsables/utils/EventBusUtil";
import {useSchemaStore} from "@/stores/schema";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {MaterialDocumentModel} from "@/componsables/models/MaterialModel";
import {onMounted, ref} from 'vue';
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {$engine} from "@/renren-engine/engine";
import {$message} from "@/componsables/element-plus";




const schemaStore = useSchemaStore();
const animationList = ref<RenrenInterface.keyValueType<string>[]>([]);


/**
 * @description 添加动画事件
 */
function addAnimation2MaterialHandler() {
  const material: RenrenMaterialModel | MaterialDocumentModel | undefined = schemaStore.currentElement;
  if (material !== void 0) {
    if (material.type === 'material') {
      $event.emit(`addAnimation:${(material as RenrenMaterialModel)?.id}`);
    }
  }
}


/**
 * @description 处理物料动画预览事件
 */
function previewMaterialAnimationHandler() {
  if (schemaStore.currentElement !== void 0 && schemaStore.currentElement?.type === 'material') {
    const material = schemaStore.currentElement as RenrenMaterialModel;
    $event.emit(`previewAnimation:${material.id}`);
  }
}


/**
 * @description 添加动画效果信息到列表中
 */
function addAnimationInfo2List() {
  if (schemaStore.currentElement !== void 0 && schemaStore.currentElement?.type === 'material') {
    const material = schemaStore.currentElement as RenrenMaterialModel;
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
      // 清空 schema 对应组件的 animation 属性
      const schema: RenrenMaterialModel | MaterialDocumentModel | undefined = await $engine.getSchema();
      if (schema !== void 0 && schema.type === 'document') {
        if (schema.nodes && schema.nodes.length > 0) {
          const material = schema.nodes.find(item => item.id === (schemaStore.currentElement as RenrenMaterialModel)?.id);
          if (material !== void 0 && material.animation) {
            if (material.animation.length > 0) {
              material.animation = [];
              // 更新 schema
              await $engine.updateSchema(schema as MaterialDocumentModel);
            }
          }
        }
      }
      // 清空 schemaStore.currentElement.animation
      if (schemaStore.currentElement && schemaStore.currentElement?.type === 'material') {
        const material = schemaStore.currentElement as RenrenMaterialModel;
        if (material.animation && material.animation.length > 0) {
          material.animation = [];
          schemaStore.currentElement = material;
        }
      }
      // 清空 animationList
      animationList.value = [];
      $message({
        type: 'info',
        message: '移除动画效果'
      });
      resolve('删除动画效果成功');
    } catch (e) {
      console.log('删除动画效果失败', e);
      reject('删除动画效果失败');
    }
  });
}



$event.on('addAnimation', () => {
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
        :header-cell-style="{ backgroundColor: '#5ea0ff', alignItems: 'center', color: '#000' }"
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
              <el-button @click="removeAnimationBinding(row.key)" size="small" type="text">删除动画</el-button>
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
