<script setup lang="ts">

</script>

<template>
  <div class="w-full h-full flex justify-end">
    <div style="width: calc(90% - 60px);" class="editor-aside flex shadow-sm flex-col bg-white relative p-4">
      <!-- attributes configuration slot -->
      <slot name="attributes" />
    </div>
    <div
      style="border-top: 1px solid #e4e7ed;"
      class="w-[60px] h-full flex flex-col bg-header-dark"
    >

    </div>
  </div>
</template>

<style scoped>
.editor-aside {
  height: 100%;
}

.editor-aside::after {
  content: '<';
  width: 25px;
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 5px 0 0 5px;
  background-color: #fff;
  position: absolute;
  left: -25px;
  top: 50%;
  padding-left: 5px;
  cursor: pointer;
}
</style>
