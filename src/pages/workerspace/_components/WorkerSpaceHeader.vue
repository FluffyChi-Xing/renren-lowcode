<script setup lang="ts">
import { useRouter } from "vue-router";
import TheHeader from "@/components/TheHeader.vue";
import CanvasSizeConfiguration from "@/pages/workerspace/_components/header/CanvasSizeConfiguration.vue";
import ProjectFunctionalBanner from "@/pages/workerspace/_components/header/ProjectFunctionalBanner.vue";


const router = useRouter();


/**
 * @description 刷新页面
 */
function refreshPage() {
  router.push('/workerspace');
}
</script>

<template>
  <TheHeader>
    <template #left>
      <div class="w-full h-full pl-10 text-gray-50 flex items-center">
        <!-- TODO: logo -->
        <span @click="refreshPage" class="w-auto h-auto flex text-[1.2rem] cursor-pointer font-bold">人人低码</span>
      </div>
    </template>
    <template #middle>
      <CanvasSizeConfiguration />
    </template>
    <template #right>
      <ProjectFunctionalBanner />
    </template>
  </TheHeader>
</template>

<style scoped>

</style>
