<template>
  <VueDraggable
    v-bind="$attrs"
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
    @start="startDrag"
    :group="group"
    :ghost-class="ghostClass"
    :animation="animation"
  >
    <slot />
  </VueDraggable>
</template>

<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus';
defineProps({
  modelValue: { type: Array, default: () => [] },
  group: { type: String, default: 'default' },
  ghostClass: { type: String, default: 'ghost' },
  animation: { type: Number, default: 150 }
});

const emit = defineEmits(['update:modelValue', 'start']);
function updateModelValue(value: any) {
  emit('update:modelValue', value);
}

function startDrag(index: any) {
  emit('start', index);
}
</script>
