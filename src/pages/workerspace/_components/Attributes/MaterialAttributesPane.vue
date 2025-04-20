<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {useSchemaStore} from "@/stores/schema";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {$message} from "@/componsables/element-plus";
import {propAttributesMap, propAttributesOptionsMap, propAttributesTypeMap} from "@/componsables/utils/AttrUtil";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import { throttle } from "lodash-es";
import {$engine} from "@/renren-engine/engine";
import {useCanvasStore} from "@/stores/canvas";
import {generateUUID} from "@/componsables/utils/GenerateIDUtil";
import $event from "@/componsables/utils/EventBusUtil";


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



const throttledCSSAttributesUpdateHandler = throttle(
  async function cssAttributesUpdateHandler(item: RenrenMaterialModel, props: MaterialInterface.IProp[]): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (item && props) {
          if (props.length > 0 && item.props) {
            item.props.items = props;
            // 更新 schema & schemaStore
            await $engine.updateMaterialNodeById(item as MaterialInterface.IMaterial).catch(err => {
              $message({
                type: 'warning',
                message: err as string
              });
            });
            schemaStore.currentElement = item;
            // canvasStore.updateFlag = generateUUID();
            $event.emit(`updateMaterial:${item.id}`);
            resolve('样式更新成功');
          }
        }
      } catch (e) {
        console.error('样式更新失败', e);
        reject('样式更新失败');
      }
    });
  },
  16
);


/**
 * @description 处理输入型事件
 */
function inputChangeHandler(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      // 调用样式更新函数
      await throttledCSSAttributesUpdateHandler(schemaStore.currentElement as RenrenMaterialModel,materialAttribute.value).catch(err => {
        $message({
          type: 'warning',
          message: err as string
        });
      });
      resolve('输入框事件处理成功');
    } catch (e) {
      console.error('输入框事件处理失败', e);
      reject('输入框事件处理失败');
    }
  });
}


/**
 * @description 处理 select 型事件
 */
function selectChangeHandler(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      await throttledCSSAttributesUpdateHandler(schemaStore.currentElement as RenrenMaterialModel,materialAttribute.value).catch(err => {
        $message({
          type: 'warning',
          message: err as string
        });
      });
    } catch (e) {
      console.error('select 事件处理失败', e);
      reject('select 事件处理失败');
    }
  });
}


/**
 * @description 处理 switch 型事件
 */
function switchChangeHandler(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      await throttledCSSAttributesUpdateHandler(schemaStore.currentElement as RenrenMaterialModel,materialAttribute.value).catch(err => {
        $message({
          type: 'warning',
          message: err as string
        });
      });
    } catch (e) {
      console.error('switch 事件处理失败', e);
      reject('switch 事件处理失败');
    }
  });
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
          @change="inputChangeHandler"
          @keydown.enter="inputChangeHandler"
        />
        <!-- 如果是 select -->
        <el-select
          v-if="propAttributesTypeMap.get(item.type) === 'select'"
          v-model="materialAttribute[index].value"
          clearable
          :disabled="item.type === 'position'"
          @change="selectChangeHandler"
        >
          <el-option
            v-for="(itm, index) in getSelectOptionsList(item.type)"
            :key="index"
            :label="itm.key"
            :value="itm.value"
          />
        </el-select>
        <!-- 如果是 switch -->
        <el-switch
          v-if="propAttributesTypeMap.get(item.type) === 'switch'"
          v-model="materialAttribute[index].value"
          @change="switchChangeHandler"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>
