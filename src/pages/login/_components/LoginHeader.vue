<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import {$util} from "@/componsables/utils";
import menuItems from './header-menu-list.json';


const menuList: RenrenInterface.keyValueType<string>[] = $util.renren.jsonTypeTransfer<RenrenInterface.keyValueType<string>[]>(menuItems)
// TODO: 添加菜单点击跳转事件
</script>

<template>
  <TheHeader>
    <template #left>
      <div class="w-full h-full pl-10 text-gray-50 flex items-center">
        <span @click="$util.renren.refreshPage()" class="w-auto h-auto flex text-[1.2rem] cursor-pointer font-bold">人人低码</span>
      </div>
    </template>
    <template #right>
      <div class="w-full h-full flex items-center justify-end pr-10">
        <div
          v-for="(item, index) in menuList"
          :key="index"
          class="w-auto h-full cursor-pointer flex items-center px-4 text-gray-100 hover:text-white hover:underline"
        >
          {{ item.key }}
        </div>
      </div>
    </template>
  </TheHeader>
</template>

<style scoped>

</style>
