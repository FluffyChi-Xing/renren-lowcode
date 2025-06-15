<template>
  <!-- 页面属性面板 -->
  <div class="w-full h-full flex flex-col">
    <el-form label-width="auto">
      <el-form-item
        v-for="(item, index) in documentAttribute"
        :key="index"
        :label="propAttributesMap.get(item.type)"
      >
        <!-- 如果是 input -->
        <el-input
          v-if="propAttributesTypeMap.get(item.type) === 'input'"
          disabled
          v-model="documentAttribute[index].value"
          clearable
          @change="inputChangeDebounceHandler"
          @keydown.enter="inputChangeDebounceHandler"
        />
        <!-- 如果是 color-picker -->
        <el-color-picker
          v-if="propAttributesTypeMap.get(item.type) === 'picker'"
          v-model="documentAttribute[index].value"
          @change="documentColorChangeHandler"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {MaterialDocumentModel} from "@/componsables/models/MaterialModel";
import type {MaterialInterface} from "@/componsables/interface/MaterialInterface";
import {$message} from "@/componsables/element-plus";
import {propAttributesMap, propAttributesTypeMap} from "@/componsables/utils/AttrUtil";
import { debounce } from "lodash-es";
import {$util} from "@/componsables/utils";
import {mySchemaStore} from "@/stores/schema";
import {myCanvasStore} from "@/stores/canvas";
import {container} from "@/renren-engine/__init__";
import type {IEngine} from "@/renren-engine";


/** ===== 文档节点属性绑定-start =====**/
const documentAttribute = ref<MaterialInterface.IProp[]>([]);
const engine = container.resolve<IEngine>('engine');

// TODO: 将数据同步到 schema 中
/**
 * @description 根据当前文档节点的属性初始化响应式对象
 */
function initDocumentAttributeData(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      await $util.renren.isDocument(mySchemaStore.currentElement, () => {
        const document: MaterialDocumentModel = engine.arrangement.getDocument(myCanvasStore.currentDocName) as MaterialDocumentModel;
        // 清空现有响应式对象
        documentAttribute.value = [];
        if (document.prop?.items && document.prop.items?.length > 0) {
          document.prop.items.forEach((item: MaterialInterface.IProp) => {
            documentAttribute.value.push(item);
          });
          resolve('初始化文档节点响应式属性数据成功');
        }
      });
    } catch (e) {
      console.error('初始化文档节点响应式属性数据失败', e);
      reject('初始化文档节点响应式属性数据失败');
    }
  });
}


/**
 * @description 处理画布颜色更新事件
 * @param color
 */
async function documentColorChangeHandler(color: string) {
  if (color) {
    myCanvasStore.canvasColor = color;
    await engine.renderer.updateDocumentProps(documentAttribute.value, myCanvasStore.currentDocName).catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
  }
}

/**
 * @description 输入框事件处理
 */
const inputChangeDebounceHandler = debounce(() => {
  function inputChangeHandler() {
    documentAttribute.value.forEach(style => {
      if (style.type === 'opacity') {
        myCanvasStore.opacity = style.value || 1;
      } else if (style.type === 'line-height') {
        myCanvasStore.lineHeight = style.value || 16;
      }
    });
    // 由于输入框事件可能频繁触发，这里使用 debounce 节流处理
    engine.renderer.updateDocumentProps(documentAttribute.value).catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
  }
  inputChangeHandler();
}, 50);
/** ====== 文档属性绑定-end ===== **/


onMounted(() => {
  initDocumentAttributeData().catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
});
</script>
