<script setup lang="ts">
import {PROJECT_LOGO_URL} from "@/componsables/constants/RenrenConstant";
</script>

<template>
  <div class="w-full h-full flex items-center justify-center relative">
    <!-- logo -->
    <div class="w-[250px] h-[250px] select-none flex z-[99]">
      <el-image
        :src="PROJECT_LOGO_URL"
        fit="contain"
        class="w-full h-full"
        loading="lazy"
        alt="logo"
      />
    </div>
    <!-- layer -->
    <div class="w-[250px] h-[250px] flex bg-yellow-500 absolute logo-background" />
  </div>
</template>

<style scoped>
.logo-background {
  background: linear-gradient(-45deg, #33FF33 30%, #35495e80);
  filter: blur(72px);
}
</style>
