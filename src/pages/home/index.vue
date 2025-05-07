<script setup lang="ts">
import HomeHeader from "@/pages/home/_components/HomeHeader.vue";
import HomeDescription from "@/pages/home/_components/HomeDescription.vue";
import HomeLogo from "@/pages/home/_components/HomeLogo.vue";
import FeatureCard from "@/components/FeatureCard.vue";
import {FEATURE_INFO_LIST} from "@/componsables/constants/RenrenConstant";
import {useRouter} from "vue-router";




const router = useRouter();
/** ===== 新建项目-start ===== **/


/**
 * @description 新建项目
 */
function createNewProject() {
  router.push('/manage');
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
