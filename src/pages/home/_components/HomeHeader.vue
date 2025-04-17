<script setup lang="ts">
import {GITHUB_REPOSITORY, PROJECT_LOGO_URL} from "@/componsables/constants/RenrenConstant";
import TheHeader from "@/components/TheHeader.vue";
import {openExternalLink} from "@/componsables/utils/RenrenUtil";
import {$message} from "@/componsables/element-plus";

function refreshPage() {
  location.reload();
}


/**
 * @description 查看项目的 github 主页
 */
function jump2Github() {
  openExternalLink(GITHUB_REPOSITORY).catch(err => {
    $message({
      type: 'warning',
      message: err as string
    });
  });
}
</script>

<template>
  <TheHeader>
    <template #left>
      <div class="w-full h-full pl-10 text-gray-50 flex items-center">
        <div class="w-10 h-full flex mr-2">
          <el-image
            :src="PROJECT_LOGO_URL"
            fit="contain"
            class="w-full h-full"
            loading="lazy"
          />
        </div>
        <span @click="refreshPage" class="w-auto h-auto flex text-[1.2rem] cursor-pointer font-bold">人人低码</span>
      </div>
    </template>
    <template #right>
      <div class="w-full h-full flex justify-end items-center pr-10">
        <span @click="jump2Github" class="text-gray-50 cursor-pointer hover:text-white hover:underline">Github</span>
      </div>
    </template>
  </TheHeader>
</template>

<style scoped>

</style>
