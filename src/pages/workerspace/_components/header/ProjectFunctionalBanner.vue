<script setup lang="ts">



const emits = defineEmits(['reset', 'revert', 'preview', 'save', 'export']);
</script>

<template>
  <div class="w-full h-full flex justify-end items-center pr-10">
    <!-- 撤销/重做 -->
    <el-button-group class="mr-2">
      <el-tooltip
        placement="bottom"
        effect="light"
        content="撤销"
      >
        <el-button
          icon="ArrowLeft"
        />
      </el-tooltip>
     <el-tooltip
       placement="bottom"
       effect="light"
       content="反做"
     >
       <el-button
         icon="ArrowRight"
       />
     </el-tooltip>
    </el-button-group>
    <!-- 出码 -->
    <el-button type="primary">出码</el-button>
    <!-- 保存到本地 -->
    <el-button>保存到本地</el-button>
    <!-- 预览 -->
    <el-button type="primary">预览</el-button>
  </div>
</template>

<style scoped>

</style>
