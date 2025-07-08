<script setup lang="ts">
/**
 * @description 锁定与解锁组件
 * @author FluffyChi-Xing
 * @event lock which means the material need to be locked
 * @event unlock which means the material need to be unlocked
 */
import { ref } from 'vue';
import $event from "@/componsables/utils/EventBusUtil";
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";
import {mySchemaStore} from "@/stores/schema";
import {$message} from "@/componsables/element-plus";
import {$util} from "@/componsables/utils";



const functionList = ref<RenrenInterface.KeyValueIndexType<Function, string>[]>([
  {
    key: '锁定',
    value: lockMaterialNode,
    index: 'Lock'
  },
  {
    key: '解锁',
    value: unLockMaterialNode,
    index: 'Unlock'
  },
]);



/**
 * @description 锁定物料节点
 */
function lockMaterialNode() {
  const currentElement: any = mySchemaStore.getCurrentElement;
  $util.renren.isMaterial(currentElement, () => {
    const material = currentElement as RenrenMaterialModel;
    if (!material?.isLocked) {
      material.isLocked = true;
      mySchemaStore.setCurrentElement(material);
      $message({
        type: 'info',
        message: '节点已锁定',
      });
    }
    $event.emit('clearContext');
  }).catch(_ => {
    $message({
      type: 'warning',
      message: '请先选择要锁定的组件'
    });
  });
}


/**
 * @description 解锁物料节点
 */
function unLockMaterialNode() {
  const currentElement: any = mySchemaStore.getCurrentElement;
  $util.renren.isMaterial(currentElement, () => {
    const material = currentElement as RenrenMaterialModel;
    if (material?.isLocked) {
      material.isLocked = false;
      mySchemaStore.setCurrentElement(material);
      $message({
        type: 'info',
        message: '节点已解锁',
      });
    }
    $event.emit('clearContext');
  }).catch(_ => {
    $message({
      type: 'warning',
      message: '请先选择要解锁的组件'
    });
  });
}

$event.on('lock', () => {
  lockMaterialNode();
});

$event.on('unlock', () => {
  unLockMaterialNode();
});
</script>

<template>
  <el-tooltip
    v-for="(item, index) in functionList"
    :key="index"
    effect="dark"
    placement="left"
    :content="item.key"
  >
    <el-button
      :icon="item.index"
      circle
      @click="item.value"
    />
  </el-tooltip>
</template>
