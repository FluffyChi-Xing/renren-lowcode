<script setup lang="ts">
const props = withDefaults(defineProps<{
  show?: boolean | undefined;
  width?: number;
  height?: number;
  start?: RenrenInterface.XAndYType<number, number>;
}>(), {
  show: false
});
</script>

<template>
  <div
    v-if="show"
    class="area"
    :style="{
      left: start?.x + 'px',
      top: start?.y + 'px',
      width: width + 'px',
      height: height + 'px',
    }"
  />
</template>

<style scoped>
.area {
  border: 1px dashed #0066ff;
  position: absolute;
}
</style>
