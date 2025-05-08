<script setup lang="ts">
withDefaults(defineProps<{
  style?: string;
  title?: string;
  value?: string | number;
  loading?: boolean;
  prefix?: string;
  prefixColor?: string;
}>(), {
  style: '',
  title: '统计面板',
  value: '1000.0',
  loading: false,
  prefixColor: '',
})
</script>

<template>
  <el-card
    :style="style"
    class="statistic-container"
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
          <div class="statistic-title">
            {{ title }}
          </div>
          <!-- value -->
          <div
            style="font-size: 24px;"
            class="w-full h-full flex items-center text-black"
          >
            <el-icon
              v-if="(prefix !== void 0 && typeof prefix === 'string')"
              size="24"
              :color="prefixColor"
            >
              <component :is="prefix" />
            </el-icon>
            <span class="statistic-value">{{ value }}</span>
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
