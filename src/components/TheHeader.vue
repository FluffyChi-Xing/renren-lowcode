<script setup lang="ts">

</script>

<template>
  <div class="w-full h-full grid grid-cols-3 gap-4 bg-header-dark">
    <div class="w-full h-full flex">
      <slot name="left" />
    </div>
    <div class="w-full h-full flex">
      <slot name="middle" />
    </div>
    <div class="w-full h-full flex">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>

</style>
