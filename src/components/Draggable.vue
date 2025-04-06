<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable, DraggableEvent } from 'vue-draggable-plus'
import {start} from "nprogress";
const props = withDefaults(defineProps<{
  list?: Array<any>;
  animate?: boolean;
  chosenClass?: string; // 被选中项的css类名
  delay?: number; // 延迟时间
  direction?: 'vertical' | 'horizontal'; // 拖拽方向
  disabled?: boolean; // 是否禁用
  dragClass?: string; // 拖拽项的css类名
  easing?: string; // 动画效果
  fallBackOnBody?: boolean; // 将 cloned dom 挂载在body上
  filter?: string; // 不需要拖动的元素
  forceFallBack?: boolean; // 忽略h5默认的拖拽行为
  ghostClass?: string; // drop placeholder的css类名
  group?: string | undefined; // 分组
  sort?: boolean; // 是否排序
}>(), {
  animate: true,
  chosenClass: '',
  delay: 0,
  direction: 'horizontal',
  disabled: false,
  dragClass: '',
  easing: '',
  fallBackOnBody: false,
  filter: '',
  forceFallBack: true,
  ghostClass: '',
  group: undefined,
  sort: false,
  list: () => [],
});


const emits = defineEmits([
  'choose',
  'unChoose',
  'start',
  'end',
  'add',
  'update',
  'sort',
  'rename',
  'remove',
  'filter',
  'move',
  'clone',
  'change'
]);
const bindList = ref<any[]>(props.list || []);


/**
 * @description 拖拽开始事件
 * @param e
 */
function startDrag(e: DraggableEvent) {
  emits('start', e);
}
</script>

<template>
  <VueDraggable
    v-model="bindList"
    :disabled="disabled"
    :animation="animate"
    :sort="sort"
    :delay="delay"
    :chosen-class="chosenClass"
    :direction="direction"
    :easing="easing"
    :fallback-on-body="fallBackOnBody"
    :filter="filter"
    :ghost-class="ghostClass"
    :force-fallback="forceFallBack"
    :drag-class="dragClass"
    :group="group"
    @start="startDrag"
  >
    <slot name="default" />
  </VueDraggable>
</template>

<style scoped>

</style>
