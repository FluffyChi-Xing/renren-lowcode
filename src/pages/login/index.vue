<script setup lang="ts">
import LoginHeader from "@/pages/login/_components/LoginHeader.vue";
import LoginCard from "@/pages/login/_components/LoginCard.vue";
</script>

<template>
  <div class="w-full h-full flex flex-col login-bg">
    <el-container>
      <el-header>
        <LoginHeader />
      </el-header>
      <el-main>
        <div class="w-full h-full grid grid-cols-2 gap-4">
          <div class="w-full h-full flex" />
          <div class="w-full h-full flex flex-col">
            <LoginCard />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
:deep(.el-header) {
  padding: 0;
}

.login-bg {
  background-image: url("@/assets/img/login-bg.png");
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
