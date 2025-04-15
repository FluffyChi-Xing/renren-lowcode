<script setup lang="ts">
const emits = defineEmits(['start', 'about']);


/**
 * @description 处理创建项目事件
 */
function quickStart() {
  emits('start');
}


/**
 * @description 处理关于我们事件
 */
function aboutUS() {
  emits('about');
}
</script>

<template>
  <div class="w-full h-full flex justify-center select-none">
    <!-- inner-container -->
    <div class="w-auto h-full grid grid-rows-3 gap-4">
      <p class="w-full h-auto font-bold text-[56px] title">人人低代码平台</p>
      <p class="w-full h-auto font-bold text-[34px] description">快速开发，快速上线</p>
      <!-- functional banner -->
      <div class="w-full h-full flex items-center">
        <!-- TODO: 绑定创建项目功能 -->
        <el-button @click="quickStart" round type="primary" size="large" style="background: #33FF33;border-color: transparent;color: #35495e;">创建项目</el-button>
        <el-button @click="aboutUS" round plain size="large" style="border-color: #33FF33;color: #33FF33;">关于我们</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  background: -webkit-linear-gradient(120deg, #35495e -80%, #33FF33);
  color: transparent;
  background-clip: text;
}

.description {
  background: -webkit-linear-gradient(120deg, #35495e -80%, #282C34);
  color: transparent;
  background-clip: text;
}
</style>
