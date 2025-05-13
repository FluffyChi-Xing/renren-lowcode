<script setup lang="ts">
import { inject } from "vue";
import type {PluginApiInterface} from "@/componsables/interface/PluginApiInterface";


const emits = defineEmits(['reset', 'revert', 'preview', 'save', 'export']);
const { pluginGet } = inject<PluginApiInterface.IPluginFuncType>('plugin');

</script>

<template>
  <div class="w-full h-full flex justify-end items-center pr-10">
    <!-- 撤销/重做 -->
    <component :is="pluginGet('UndoRedo')" class="mr-2" />
    <!-- 出码 -->
    <component :is="pluginGet('CodeGenerator')" class="mr-2" />
    <!-- 保存到本地 -->
    <component :is="pluginGet('SaveLocal')" class="mr-2" />
    <!-- 预览 -->
    <component :is="pluginGet('SchemaPreview')" />
  </div>
</template>

<style scoped>

</style>
