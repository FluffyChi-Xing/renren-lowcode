<script setup lang="ts">
import { reactive } from 'vue';
import useUser from "@/componsables/hooks/userHooks";
// 登录表单数据
const loginForm = reactive<UserInfoReqDto.UserLoginReqDto>({
  code: "",
  password: "",
  username: "",
  secretKey: ""
});
const { login } = useUser();
</script>

<template>
  <div class="w-full h-full px-5 flex flex-col justify-center">
    <span style="font-size: 28px;color: black;font-weight: 700;margin-bottom: 10px;">登录</span>
    <el-form label-width="auto">
      <el-form-item required label="用户名">
        <el-input
          v-model="loginForm.username"
          clearable
          placeholder="请输入用户名"
          style="width: 240px;"
        />
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input
          v-model="loginForm.password"
          clearable
          placeholder="请输入密码"
          style="width: 240px;"
          type="password"
          maxlength="16"
          show-password
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="验证码" required>
        <!-- captcha-component -->
      </el-form-item>
      <el-form-item>
        <div class="w-full h-auto grid grid-cols-2 gap-4">
          <div class="text-blue-500 w-full h-auto flex items-center hover:underline">忘记密码?</div>
          <div class="w-full h-auto flex items-center justify-end">
            <el-button @click="login(loginForm)" style="background: black;color: white;">登录</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>

</style>
