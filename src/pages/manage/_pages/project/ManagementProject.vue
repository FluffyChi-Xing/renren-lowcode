<script setup lang="ts">
import { ref } from 'vue';
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";



/** ========== 表格初始化-start ==========**/
const tableColumnList = ref<RenrenInterface.keyValueType<string>[]>([
  {
    key: 'id',
    value: 'projectId'
  },
  {
    key: '项目名称',
    value: 'projectName'
  },
  {
    key: '项目路径',
    value: 'projectPath'
  },
  {
    key: '模拟器路径',
    value: 'simulatorHost'
  },
]);
/** =========== 表格初始化-end ==========**/
</script>

<template>
  <ManageLayout>
    <template #header>
      <el-button type="primary" size="small">创建项目</el-button>
    </template>
    <template #default>
      <el-table
        stripe
        border
        fit
        :header-cell-style="{ backgroundColor: '#33FF33', alignItems: 'center', color: '#000' }"
        class="w-full h-full mt-10"
      >
        <el-table-column
          type="expand"
          label="项目页面节点"
          width="200"
        >
          <template #default="{ row }">
            <div class="w-full h-20 flex bg-red-500"></div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumnList"
          :column-key="index"
          :label="item.key"
          :prop="item.value"
          :show-overflow-tooltip="item.key === 'id'"
          width="200"
        />
        <el-table-column
          label="操作"
          :fixed="'right'"
          width="200"
        >
          <template #default="{ row }">
            <div class="w-full h-auto flex items-center justify-center">
              <el-button type="primary" size="small" plain>编辑</el-button>
              <el-button type="danger" size="small" plain>删除</el-button>
              <el-button type="info" size="small" plain>开始</el-button>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无项目" />
        </template>
      </el-table>
    </template>
  </ManageLayout>
</template>

<style scoped>

</style>
