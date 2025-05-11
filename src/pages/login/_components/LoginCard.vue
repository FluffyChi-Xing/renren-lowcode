<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from "@/pages/login/_components/LoginForm.vue";
import RegisterForm from "@/pages/login/_components/RegisterForm.vue";



/** ========== 登录表单初始化-start ==========**/
const layer = ref();
const isRegister = ref<boolean>(true);
// 当前所在的表单
const currentForm = ref(LoginForm);


/**
 * @description 控制菜单蒙层滑动
 */
function slideLayer() {
  isRegister.value = !isRegister.value;
  if (layer.value) {
    if (isRegister.value) {
      currentForm.value = LoginForm;
      layer.value.classList.remove('right');
    } else {
      currentForm.value = RegisterForm;
      layer.value.classList.add('right');
    }
  }
}
/** ========== 登录表单初始化-end ==========**/
</script>

<template>
  <el-card style="border: none;" class="w-full h-full">
    <div class="w-full h-full grid grid-cols-2 gap-4 relative">
      <!-- login-area -->
      <div class="w-full h-full p-5 flex flex-col items-center justify-center">
        <p class="text-gray-400 text-[28px] flex mb-4">
          已有账号?
        </p>
        <p class="text-gray-400 text-[24px] flex mb-4">
          快来登录!
        </p>
        <div class="w-full h-auto flex justify-center">
          <el-button @click="slideLayer">去登录</el-button>
        </div>
      </div>
      <!-- register -->
      <div class="w-full h-full p-5 flex items-center justify-center flex-col">
        <p class="text-gray-400 text-[28px] flex mb-4">
          没有账号?
        </p>
        <p class="text-gray-400 text-[24px] flex mb-4">
          快来注册!
        </p>
        <div class="w-full h-auto flex justify-center">
          <el-button @click="slideLayer">去注册</el-button>
        </div>
      </div>
      <!-- slide-layer -->
      <div
        ref="layer"
        style="width: calc(50%);"
        class="w-auto h-full flex flex-col left-4 bg-white layer z-[99] absolute"
      >
        <component :is="currentForm" />
      </div>
    </div>
  </el-card>
</template>

<style scoped>
:deep(.el-card__body) {
  width: 100%;
  height: 100%;
  background: black;
  outline: none;
  border: none;
  padding: 0;
}


.layer {
  transition: .5s all ease;
}

.right {
  transform: translateX(90%);
}
</style>
