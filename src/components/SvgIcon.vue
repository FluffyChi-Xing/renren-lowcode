<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
    :style="style"
    v-bind="$attrs"
  >
    <use
      :xlink:href="iconName"
      :fill="fill"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  iconClass?: string,
  className?: string,
  size?: string,
  fill?: string,
}>(), {
  className: '',
  size: '',
  fill: ''
})

const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})

const svgClass = computed(() => {
  if (props.className) {
    return 'svg-icon ' + props.className
  } else {
    return 'svg-icon'
  }
})

const style = computed(() => {
  return props.size ? { fontSize: props.size } : {}
})

</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
}
</style>

