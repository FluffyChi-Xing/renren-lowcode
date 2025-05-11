<script setup lang="ts">
import $event from "@/componsables/utils/EventBusUtil";
import {useSchemaStore} from "@/stores/schema";
import {Stack} from "@/componsables/models/RenrenModel";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$message} from "@/componsables/element-plus";
import { debounce } from "lodash-es";
import { watch } from "vue";
import {$util} from "@/componsables/utils";


const emits = defineEmits(['reset', 'revert', 'preview', 'save', 'export']);
const schemaStore = useSchemaStore();

/** ===== 撤销&反做事件处理-start =====**/
// 撤销栈
const resetStack: Stack<RenrenMaterialModel> = new Stack<RenrenMaterialModel>();
// 反做栈
const revertStack: Stack<RenrenMaterialModel> = new Stack<RenrenMaterialModel>();


/**
 * @description 更新站内元素函数
 */
function updateTargetMaterial(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      if ($util.store.isCurrentElementAMaterial()) {
        const material = schemaStore.currentElement as RenrenMaterialModel;
        resetStack.push(material);
        resolve('更新成功');
      }
    } catch (e) {
      console.error('更新失败', e);
      reject('更新失败');
    }
  });
}

/**
 * @description 处理插入物料事件
 */
function insertMaterialHandler(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const debounceInsert = debounce(() => {
        if ($util.renren.isElementAMaterialModelType(schemaStore.newElement)) {
          resetStack.push(schemaStore.newElement as RenrenMaterialModel);
          resolve('插入物料事件处理成功');
        }
      }, 100);
      debounceInsert();
    } catch (e) {
      console.error('插入物料事件处理失败', e);
      reject('插入物料事件处理失败');
    }
  });
}


/**
 * @description 撤销操作
 */
function resetEvent<T extends RenrenMaterialModel>(): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    try {
      let head: RenrenMaterialModel | undefined = resetStack.pop();
      if ($util.renren.isElementAMaterialModelType(head)) {
        // revert stack push stack-head
        revertStack.push(head);
        // sync to store
        schemaStore.elementInProcess = undefined; // 初始化 store
        schemaStore.elementInProcess = head as RenrenMaterialModel;
        resolve(head as T);
      }
    } catch (e) {
      console.error('撤销失败', e);
      reject('撤销失败');
    }
  });
}

/**
 * @description 操作撤销事件
 */
function resetMaterialHandler() {
  resetEvent().then(head => {
    // emit reset event
    $event.emit(`reset:${head?.id}`);
  }).catch(err => {
    console.log(err as string);
  });
}


/**
 * @description 反做事件
 */
function revertEvent<T extends RenrenMaterialModel>(): Promise<T> {
  return new Promise<T>((resolve, reject) =>{
    try {
      // revert stack pop stack-head
      let head: RenrenMaterialModel | undefined = revertStack.pop();
      if ($util.renren.isElementAMaterialModelType(head)) {
        // reset stack push stack-head
        resetStack.push(head);
        // sync to store
        schemaStore.elementInProcess = undefined;
        schemaStore.elementInProcess = head as RenrenMaterialModel;
        resolve(head as T);
      }
    } catch (e) {
      console.error('反做失败', e);
      reject('反做失败');
    }
  });
}



/**
 * @description 操作反做事件
 */
function revertMaterialHandler() {
  revertEvent().then(head => {
    // emit revert event
    $event.emit(`revert:${head?.id}`);
  }).catch(err => {
    console.error(err as string);
  });
}


/**
 * @description 处理物料插入事件
 */
watch(() => schemaStore.newElement, () => {
  const material = schemaStore.newElement as RenrenMaterialModel;
  $event.on(`pushMaterial:${material?.id}`, () => {
    insertMaterialHandler().catch(err => {
      $message({
        type: 'warning',
        message: err as string
      });
    });
  });
});


/**
 * @description 处理画布清空事件
 */
$event.on('clearCanvas', () => {
  Promise.all([
    resetStack.clear(),
    revertStack.clear(),
  ]).then(() => {
    schemaStore.elementInProcess = undefined;
  }).catch(err => {
    console.log('清空失败', err);
  });
});


/**
 * @description 处理动画添加事件
 */
$event.on(`addAnimation:${(schemaStore.currentElement as RenrenMaterialModel)?.id}`, () => {
  updateTargetMaterial().catch(err => {
    console.log(err as string);
  });
});


/**
 * @description 处理物料(样式)更新事件
 */
$event.on(`updateMaterial:${(schemaStore.currentElement as RenrenMaterialModel)?.id}`, () => {
  updateTargetMaterial().catch(err => {
    console.log(err as string);
  });
});
/** ===== 撤销&反做事件处理-end =====**/
</script>

<template>
  <div class="w-full h-full flex justify-end items-center pr-10">
    <!-- 撤销/重做 -->
    <el-button-group class="mr-2">
      <el-tooltip
        placement="bottom"
        effect="light"
        content="撤销"
      >
        <el-button
          @click="resetMaterialHandler"
          icon="ArrowLeft"
          :disabled="resetStack.isEmpty()"
        />
      </el-tooltip>
     <el-tooltip
       placement="bottom"
       effect="light"
       content="反做"
     >
       <el-button
         @click="revertMaterialHandler"
         icon="ArrowRight"
         :disabled="revertStack.isEmpty()"
       />
     </el-tooltip>
    </el-button-group>
    <!-- 出码 -->
    <el-button type="primary">出码</el-button>
    <!-- 保存到本地 -->
    <el-button>保存到本地</el-button>
    <!-- 预览 -->
    <el-button @click="() => $event.emit('previewPage')" type="primary">预览</el-button>
  </div>
</template>

<style scoped>

</style>
