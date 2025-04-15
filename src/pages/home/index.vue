<script setup lang="ts">
import HomeHeader from "@/pages/home/_components/HomeHeader.vue";
import HomeDescription from "@/pages/home/_components/HomeDescription.vue";
import HomeLogo from "@/pages/home/_components/HomeLogo.vue";
import FeatureCard from "@/components/FeatureCard.vue";
import { ref } from 'vue';
import {FEATURE_INFO_LIST} from "@/componsables/constants/RenrenConstant";


/** ===== 新建项目-start ===== **/
const isShow = ref<boolean>(false);


function createNewProject() {
  isShow.value = true;
}
/** ======= 新建项目-end ===== **/
</script>

<template>
  <el-container>
    <el-header>
      <HomeHeader />
    </el-header>
    <el-main>
      <!-- 项目创建页面 -->
      <div class="w-full h-full flex flex-col p-10 bg-main-background">
        <!-- description-container -->
        <div class="w-full h-1/2 grid grid-cols-2 gap-4">
          <!-- description -->
          <div class="w-full h-full flex">
            <HomeDescription @start="createNewProject" />
          </div>
          <!-- logo -->
          <div class="w-full h-full flex">
            <HomeLogo />
          </div>
        </div>
        <!-- functional-banner -->
        <div class="w-full h-full grid grid-cols-3 gap-4">
          <div
            v-for="(item, index) in FEATURE_INFO_LIST"
            :key="index"
            class="w-full h-full flex items-center justify-center"
          >
            <FeatureCard
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
              :hover="item.hover"
            />
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
  <!-- drawer -->
  <el-drawer
    v-model="isShow"
    title="新建项目"
    :show-close="false"
    :close-on-click-modal="false"
    direction="rtl"
    size="350"
  >
    <template #header>
     <div class="w-full h-auto grid grid-cols-2 gap-4">
       <div class="w-full h-auto flex items-center text-black font-bold">新建项目</div>
       <div class="w-full h-auto flex items-center justify-end">
         <el-button type="text" icon="Close" @click="() => isShow = false">关闭</el-button>
       </div>
     </div>
    </template>
    <template #default>
      <el-scrollbar height="550">
        <div class="w-full h-full flex flex-col bg-red-500">
          <!-- TODO: create a new project configuration -->
        </div>
      </el-scrollbar>
    </template>
  </el-drawer>
</template>

<style scoped>
:deep(.el-header) {
  padding: 0;
}

:deep(.el-main) {
  padding: 0;
}

:deep(.el-scrollbar__view) {
  height: 100%;
}
</style>
