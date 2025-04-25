<script setup lang="ts">
import { consoleErrorHandler } from "@/componsables/ErrorHandler/errorHandler";
import {onMounted} from "vue";



onMounted(() => {
  consoleErrorHandler();
});
</script>

<template>
  <div class="w-screen h-screen flex flex-col">
    <RouterView />
  </div>
</template>
