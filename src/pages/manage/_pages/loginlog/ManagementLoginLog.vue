<script setup lang="ts">
import {ref, onMounted} from "vue";
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import {$api} from "@/componsables/api";
import {$message} from "@/componsables/element-plus";
import dayjs from "dayjs";



/** ========== 登录日志初始化-start ==========**/
const searchValue = ref<string>('');
const isShow = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const tableData = ref<LoginLogRespDto.LoginLogInfoRespDto[]>([]);
const total = ref<number>(0);
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const sizeOptions: number[] = [5, 10, 15, 20];


/**
 * @description 分页获取登录日志
 */
async function pageLoginLog() {
  await $api.loginLog.pageLoginLogInfoList(pageNum.value, pageSize.value)
    .then(res => {
      tableData.value = res.records;
      total.value = res.total;
    })
    .catch(_ => {
      $message({
        type: 'warning',
        message: '获取登录日志失败'
      });
    });
}


/**
 * @description 刷新页面
 */
async function refreshPage() {
  tableData.value = [];
  isLoading.value = true;
  await pageLoginLog();
  isLoading.value = false;
}
/** ========== 登录日志初始化-end ==========**/




onMounted(async () => {
  isLoading.value = true;
  await pageLoginLog();
  isLoading.value = false;
});
</script>

<template>
  <ManageLayout
    header="登录日志"
  >
    <template #default>
      <div class="w-full h-full flex pt-4 flex-col">
        <!-- search-area -->
        <div
          v-if="isShow"
          class="w-full h-auto flex items-center justify-between"
        >
          <el-form-item label="搜索" required inline-message>
            <el-input
              v-model="searchValue"
              clearable
              placeholder="请输入查询条件"
              style="width: 240px;"
            />
          </el-form-item>
          <el-button type="primary">搜索</el-button>
        </div>
        <!-- functional-banner -->
        <div class="w-full h-auto flex items-center justify-between">
          <el-button type="success" plain icon="Upload">导出</el-button>
          <div>
            <el-button
              @click="() => isShow = !isShow"
              type="primary"
              circle
              size="small"
              icon="Search"
              plain
            />
            <el-button
              icon="Refresh"
              type="info"
              circle
              plain
              size="small"
              @click="refreshPage"
            />
            <el-button
              plain
              type="warning"
              size="small"
              icon="Operation"
              circle
            />
          </div>
        </div>
        <!-- table-data -->
        <div class="w-full h-auto flex mt-4 flex-col">
          <el-table
            :data="tableData"
            v-loading="isLoading"
            stripe
            border
            fit
            :header-cell-style="{ backgroundColor: '#33FF33', alignItems: 'center', color: '#000' }"
            class="h-full"
            style="width: 100%;"
          >
            <el-table-column
              label="id"
              prop="id"
            />
            <el-table-column
              label="用户id"
              prop="userId"
            />
            <el-table-column
              label="ip"
              prop="ip"
            />
            <el-table-column
              label="浏览器"
              prop="browser"
            />
            <el-table-column
              label="登录时间"
              prop="createTime"
            >
              <template #default="{ row }">
                <span>
                  {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              prop="status"
            />
            <template #empty>
              <el-empty
                description="暂无登录日志"
              />
            </template>
          </el-table>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="w-full h-full flex items-center bg-red-500" />
    </template>
  </ManageLayout>
</template>

<style scoped>

</style>
