<script setup lang="ts">
import {RenrenMaterialModel} from "@/componsables/models/MaterialModel";

const props = withDefaults(defineProps<{
  active?: boolean;
  element?: RenrenMaterialModel | any;
  defaultStyle?: Object | any;
  index?: number | string;
}>(), {
  active: false,
  element: () => {},
  defaultStyle: () => {},
  index: 0,
});


/**
 * @description 确定当前组件是否处于选中状态
 * @returns {boolean}
 */
function isActive(): boolean {
  return props.active && !props.element.isLocked;
}
</script>

<template>
  <div
    class="w-auto h-auto absolute hover:cursor-move"
  >
    <!-- rotate icon -->
    <!-- lock icon -->
    <!-- location point -->
    <div />
    <!-- slot -->
    <slot />
  </div>
</template>

<style scoped>

</style>
