<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {useSchemaStore} from "@/stores/schema";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {$message} from "@/componsables/element-plus";
import {propAttributesMap, propAttributesOptionsMap, propAttributesTypeMap} from "@/componsables/utils/AttrUtil";
import {useCanvasStore} from "@/stores/canvas";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";


const schemaStore = useSchemaStore();
const canvasStore = useCanvasStore();


/** ===== 物料节点属性绑定-start =====**/
const materialAttribute = ref<MaterialInterface.IProp[]>([]);

// TODO: 将数据同步到 schema 中
/**
 * @description 根据当前文档节点的属性初始化响应式对象
 */
function initMaterialAttributeData(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if (schemaStore.currentElement !== void 0 && schemaStore.currentElement?.type === 'material') {
        const material: RenrenMaterialModel = schemaStore.currentElement as RenrenMaterialModel;
        // 清空现有响应式对象
        materialAttribute.value = [];
        if (material.props?.items && material.props.items?.length > 0) {
          material.props.items.forEach((item: MaterialInterface.IProp) => {
            materialAttribute.value.push(item);
          });
          resolve('初始化文档节点响应式属性数据成功');
        }
      }
    } catch (e) {
      console.error('初始化文档节点响应式属性数据失败', e);
      reject('初始化文档节点响应式属性数据失败');
    }
  });
}


/**
 * @description 获取 select 组件的 options 列表
 * @param type
 */
function getSelectOptionsList<T extends RenrenInterface.keyValueType<string>>(type: string): T[] | undefined {
  if (type) {
    // console.log(result, type);
    return propAttributesOptionsMap.get(type) as T[];
  } else {
    return undefined;
  }
}
/** ====== 物料属性绑定-end ===== **/


onMounted(() => {
  initMaterialAttributeData().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
});


watch(() => schemaStore.currentElement, () => {
  initMaterialAttributeData().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
}, {
  deep: true
});
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <el-form label-width="auto">
      <el-form-item
        v-for="(item, index) in materialAttribute"
        :key="index"
        :label="propAttributesMap.get(item.type)"
      >
        <!-- 如果是 input -->
        <el-input
          v-if="propAttributesTypeMap.get(item.type) === 'input'"
          v-model="materialAttribute[index].value"
          clearable
        />
        <!-- 如果是 select -->
        <el-select
          v-if="propAttributesTypeMap.get(item.type) === 'select'"
          v-model="materialAttribute[index].value"
          clearable
          :disabled="item.type === 'position'"
        >
          <el-option
            v-for="(itm, index) in getSelectOptionsList(item.type)"
            :key="index"
            :label="itm.key"
            :value="itm.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>
