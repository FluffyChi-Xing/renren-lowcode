<script setup lang="ts">
withDefaults(defineProps<{
  style?: string;
  title?: string;
  value?: string | number;
  loading?: boolean;
  prefix?: string;
}>(), {
  style: '',
  title: '统计面板',
  value: '1000.0',
  loading: false,
})
</script>

<template>
  <el-card
    :style="style"
    class="w-full h-auto min-h-24 p-4 flex"
  >
    <el-skeleton
      animated
      :loading="loading"
      :rows="1"
      class="w-full h-full"
    >
      <template #default>
        <div class="w-full h-full grid grid-rows-2 gap-4">
          <!-- title -->
          <div class="w-full h-full flex text-statistic-color font-[16px] items-center overflow-hidden text-ellipsis">
            {{ title }}
          </div>
          <!-- value -->
          <div
            style="font-size: 24px;"
            class="w-full h-full flex items-center text-black"
          >
            <el-icon v-if="(prefix !== void 0 && typeof prefix === 'string')" size="24">
              <component :is="prefix" />
            </el-icon>
            {{ value }}
          </div>
        </div>
      </template>
    </el-skeleton>
  </el-card>
</template>

<style scoped>
:deep(.el-card__body) {
  height: 100%;
  width: 100%;
}
</style>
