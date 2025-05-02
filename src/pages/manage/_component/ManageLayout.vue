<script setup lang="ts">
const props = withDefaults(defineProps<{
  shadow?: 'always' | 'never' | 'hover';
  header?: string;
  footer?: boolean;
}>(), {
  shadow: 'never',
  header: '标题',
  footer: true,
})
</script>

<template>
  <el-card :shadow="shadow" class="w-full h-full p-4">
    <div class="w-full h-full flex flex-col">
      <!-- the header -->
      <el-card class="w-full">
        <div class="w-full h-14 grid grid-cols-2 gap-4">
          <div class="w-full h-full flex items-center text-black font-bold p-4">
            {{ props.header }}
          </div>
          <div class="w-full h-full flex px-4 items-center justify-end">
            <slot name="header" />
          </div>
        </div>
      </el-card>
      <!-- body -->
      <div
        :style="footer ? 'height: calc(100% - 104px);' : 'height: calc(100% - 64px);'"
        class="w-full flex flex-col">
        <slot name="default" />
      </div>
      <!-- footer -->
      <div
        v-if="footer"
        class="w-full mt-auto h-10 flex items-center justify-center"
      >
        <slot name="footer" />
      </div>
    </div>
  </el-card>
</template>

<style scoped>
:deep(.el-card__body) {
  padding: 0;
  height: 100%;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
