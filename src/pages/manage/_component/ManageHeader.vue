<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import {$util} from "@/componsables/utils";
</script>

<template>
  <TheHeader>
    <template #left>
      <div class="w-full h-full pl-10 text-gray-50 flex items-center">
        <span @click="$util.renren.refreshPage()" class="w-auto h-auto flex text-[1.2rem] cursor-pointer font-bold">人人低码</span>
      </div>
    </template>
  </TheHeader>
</template>

<style scoped>

</style>
