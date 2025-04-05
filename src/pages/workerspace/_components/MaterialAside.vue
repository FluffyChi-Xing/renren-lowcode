<script setup lang="ts">
const emits = defineEmits(['collapse']);
</script>

<template>
  <div class="w-[90%] material-aside grid grid-rows-3 gap-4 bg-white p-4 relative shadow-sm">
    <!-- components draggable area -->
    <div class="w-full h-full flex flex-col row-span-2">
      <slot name="component" />
    </div>
    <!-- page element tree -->
    <div class="w-full h-full flex flex-col">
      <slot name="pageTree" />
    </div>
  </div>
</template>

<style scoped>
.material-aside {
  height: 100%;
}

.material-aside::after {
  content: '>';
  width: 25px;
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 0 5px 5px 0;
  background-color: #fff;
  position: absolute;
  right: -25px;
  top: 50%;
  padding: 3px;
  cursor: pointer;
}
</style>
