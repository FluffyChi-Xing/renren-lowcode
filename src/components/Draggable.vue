<template>
  <VueDraggable
    v-bind="$attrs"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
    @start="startDrag"
    :group="group"
    :animation="animation"
  >
    <slot />
  </VueDraggable>
</template>

<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';
withDefaults(defineProps<{
  modelValue?: any[];
  group?: any;
  animation?: number | undefined;
}>(), {
  modelValue: () => [],
});

const emit = defineEmits(['update', 'start']);
function updateModelValue(value: any[]) {
  emit('update', value[value.length - 1]);
}

function startDrag(index: any) {
  emit('start', index);
}
</script>
