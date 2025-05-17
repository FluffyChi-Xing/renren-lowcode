<script setup lang="ts">
import {onMounted, ref} from "vue";
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import {$enum} from "@/componsables/enum";
import {$api} from "@/componsables/api";
import {$message} from "@/componsables/element-plus";
import tableHeaderConfig from '@/components/table-header-config.json';
import { $util } from "@/componsables/utils";
import pageSizeOptions from "@/components/pagination-size-options.json";


/** ========== 回收站初始化-start ==========**/
const isLoading = ref<boolean>(false);
const pageNum = ref<number>(0);
const pageSize = ref<number>(10);
const sizeOptions: number[] = $util.renren.jsonTypeTransfer<number[]>(pageSizeOptions);
const total = ref<number>(0);
const tableData = ref<MaterialRespDto.MaterialInfoRespDto[]>([]);


/**
 * @description 初始化回收站数据
 */
async function initData() {
  tableData.value = [];
  await $api.material.queryRecycleBinPage(pageNum.value, pageSize.value)
    .then(res => {
      tableData.value = res.records as MaterialRespDto.MaterialInfoRespDto[];
      total.value = res.total;
    })
    .catch(_ => {
      $message({
        type: 'warning',
        message: '分页获取信息失败'
      });
    });
}



async function refreshData() {
  isLoading.value = true;
  await initData();
  isLoading.value = false;
}



async function pageChange(index: number, size: number) {
  pageNum.value = index;
  pageSize.value = size;
  isLoading.value = true;
  await initData();
  isLoading.value = false;
}
/** ========== 回收站初始化-end ==========**/


onMounted(async () => {
  isLoading.value = true;
  await initData();
  isLoading.value = false;
});
</script>

<template>
  <ManageLayout
    header="物料回收站"
    :footer="true"
  >
    <template #default>
      <div class="w-full h-full flex flex-col pt-4">
        <!-- functional-banner -->
        <div class="w-full h-auto flex items-start justify-end">
          <el-button @click="refreshData" circle size="small" icon="Refresh" plain type="info" />
          <el-button circle size="small" icon="Operation" plain type="warning" />
        </div>
        <el-table
          :data="tableData"
          v-loading="isLoading"
          stripe
          border
          fit
          :header-cell-style="tableHeaderConfig"
          class="h-full mt-10"
          style="width: 100%;"
        >
          <el-table-column
            label="id"
            prop="id"
          />
          <el-table-column
            label="物料名换"
            prop="name"
          />
          <el-table-column
            label="物料类型"
            prop="type"
          >
            <template #default="{ row }">
              {{ $enum.MaterialTypeEnum[row.type] }}
            </template>
          </el-table-column>
          <el-table-column
            label="用户id"
            prop="userId"
          >
            <template #default="{ row }">
              {{ row.userId === 0 ? '默认' : row.userId }}
            </template>
          </el-table-column>
          <el-table-column
            label="物料状态"
            prop="status"
            width="150"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="0"
                active-text="启用"
                inactive-text="禁用"
                :inactive-value="1"
                :disabled="row.isDefalt === $enum.MaterialDefaultEnum.DEFAULT"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="是否删除"
            prop="isDelete"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.isDelete"
                :active-value="0"
                active-text="否"
                inactive-text="是"
                :inactive-value="1"
                :disabled="row.isDefalt === $enum.MaterialDefaultEnum.DEFAULT"
              />
            </template>
          </el-table-column>
          <template #empty>
            <el-empty
              description="暂无物料信息"
            />
          </template>
        </el-table>
      </div>
    </template>
    <template #footer>
      <div class="w-full h-full flex justify-center items-center">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="sizeOptions"
          layout="sizes, prev, pager, next"
          :total="total"
          @change="pageChange"
        />
      </div>
    </template>
  </ManageLayout>
</template>

<style scoped>

</style>
