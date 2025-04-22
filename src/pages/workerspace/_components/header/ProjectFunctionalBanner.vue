<script setup lang="ts">
import $event from "@/componsables/utils/EventBusUtil";
import {useSchemaStore} from "@/stores/schema";
import {Stack} from "@/componsables/models/RenrenModel";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {$message} from "@/componsables/element-plus";
import {watch} from "vue";




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
      if (schemaStore.currentElement !== void 0 && schemaStore.currentElement?.type === 'material') {
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
      if (schemaStore.newElement !== void 0 && schemaStore.newElement?.type === 'material') {
        resetStack.push(schemaStore.newElement as RenrenMaterialModel);
        resolve('插入物料事件处理成功');
      }
    } catch (e) {
      console.error('插入物料事件处理失败', e);
      reject('插入物料事件处理失败');
    }
  });
}


/**
 * @description 操作撤销事件
 */
function resetMaterialHandler() {
  console.log('撤销', resetStack);
  // reset stack pop stack-head
  const head: RenrenMaterialModel | undefined = resetStack.pop();
  if (head !== void 0 && head?.type === 'material') {
    // revert stack push stack-head
    revertStack.push(head);
    // alert message
    $message({
      type: 'info',
      message: '撤销成功'
    });
    // log
    console.log('撤销', head);
    // emit reset event
    $event.emit(`reset:${head?.id}`);
  }
}


/**
 * @description 操作反做事件
 */
function revertMaterialHandler() {
  console.log('反做', revertStack);
  // revert stack pop stack-head
  const head: RenrenMaterialModel | undefined = revertStack.pop();
  if (head !== void 0 && head?.type === 'material') {
    // reset stack push stack-head
    resetStack.push(head);
    // alert message
    $message({
      type: 'info',
      message: '反做成功'
    });
    // log
    console.log('反做', head);
    // emit revert event
    $event.emit(`revert:${head?.id}`);
  }
}


/**
 * @description 处理物料插入事件
 */
watch(() => schemaStore.newElement, () =>{
  $event.on('insert', () => {
    // console.log('新增物料', schemaStore.newElement);
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
  ]).catch(err => {
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
    <el-button type="primary">预览</el-button>
  </div>
</template>

<style scoped>

</style>
