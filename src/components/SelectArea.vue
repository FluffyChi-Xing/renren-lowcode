<script setup lang="ts">
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import {watch} from "vue";
const props = withDefaults(defineProps<{
  show?: boolean | undefined;
  width?: number;
  height?: number;
  start?: RenrenInterface.XAndYType<number, number>;
}>(), {
  show: false
});

//
// watch(() => props.show, () => {
//   console.log('start', props.start, props.width, props.height);
// });
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
  border: 1px dashed #70c0ff;
  position: absolute;
}
</style>
