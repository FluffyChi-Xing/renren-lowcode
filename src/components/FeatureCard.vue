<script setup lang="ts">
withDefaults(defineProps<{
  hover?: boolean;
  icon?: string;
  title?: string;
  description?: string;
}>(), {
  hover: false,
  icon: '🥰',
  title: '测试标题',
  description: '测试内容'
});
</script>

<template>
  <div
    :class="hover ? 'card' : ''"
    class="w-full h-[200px] block des-card bg-white p-4 rounded-[8px] max-w-[400px]"
  >
    <!-- icon -->
    <div class="w-14 h-14 flex items-center rounded-[8px] bg-[#E7E8EC] justify-center">
      <span class="text-[24px] font-bold">{{ icon }}</span>
    </div>
    <!-- title -->
    <div class="w-full mt-4 h-auto flex items-center whitespace-nowrap text-ellipsis overflow-hidden">
      <span class="w-auto h-auto text-black font-bold">{{ title }}</span>
    </div>
    <!-- description -->
    <div class="w-full mt-2 h-auto flex items-center whitespace-nowrap text-ellipsis overflow-hidden">
      <span class="w-auto h-auto text-gray-300 whitespace-pre-line break-words">{{ description }}</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: .5s all ease;
}

.card:hover {
  box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
}

.des-card {
  border: 1px solid #e4e7ec;
}
</style>
