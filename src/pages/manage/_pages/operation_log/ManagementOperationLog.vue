<script setup lang="ts">
import {ref, onMounted} from "vue";
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import type {OperationLogRespDto} from "@/componsables/interface/dto/resp/OperationLogRespDto";
import {$api} from "@/componsables/api";
import {$message} from "@/componsables/element-plus";
import dayjs from "dayjs";
import {$enum} from "@/componsables/enum";
import {OPERATION_LOG_REQUEST_HOST} from "@/componsables/constants/HttpInfoConstants";
import {getUserId} from "@/componsables/request";


/** ========= 操作日志初始化-start ==========**/
const showHeader = ref<boolean>(true);
// 查询条件
const searchQuery = ref<string>('');
// 分页参数
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const sizeOptions = ref<number[]>([5, 10, 15, 20]);
const total = ref<number>(0);
const pageLayout: string = 'sizes, prev, pager, next';
const tableData = ref<OperationLogRespDto.OperationLogInfoRespDto[]>([]);
const isLoading = ref<boolean>(false);


/**
 * @description 分页获取操作日志列表
 */
function pageOperationLogList() {
  $api.operation.pageQueryOperationLogList(
    pageNum.value,
    pageSize.value
  )
    .then(res => {
      total.value = res.total;
      tableData.value = res.records;
    }).catch(_ => {
      $message({
        type: 'warning',
        message: '获取日志失败'
      });
  });
}


/**
 * @description 重置换页数据
 * @param page
 * @param size
 */
function resetPageReqData(page: number, size: number) {
  pageNum.value = page;
  pageSize.value = size;
}


/**
 * @description 换页事件
 * @param page
 * @param size
 */
function changePage(page: number, size: number) {
  // 清空原始数据
  tableData.value = [];
  if (!searchQuery.value) {
    // 重置换页数据
    resetPageReqData(page, size);
    // 重新获取数据
    isLoading.value = true;
    pageOperationLogList();
    isLoading.value = false;
  } else {
    blurSearch();
  }
}


/**
 * @description 刷新页面
 */
function refreshPage() {
  tableData.value = [];
  searchQuery.value = '';
  isLoading.value = true;
  pageOperationLogList();
  isLoading.value = false;
}


/**
 * @description 模糊查询用户日志记录
 */
async function blurSearch() {
  if (searchQuery.value) {
    isLoading.value = true;
    await $api.operation.blurQueryOperationLog(
      searchQuery.value,
      pageNum.value,
      pageSize.value
    )
      .then(res => {
        tableData.value = [];
        res.map(item => {
          tableData.value.push(searchValueTransfer(item as OperationLogRespDto.OperationLogSearchRespDto));
        });
        isLoading.value = false;
      })
      .catch(() => {
        $message({
          type: 'warning',
          message: '查询失败'
        });
        isLoading.value = false;
      });
    isLoading.value = false;
  } else {
    $message({
      type: 'warning',
      message: '请输入名称/路径/方法'
    });
  }
}


/**
 * @description 将 搜索数据转换为表格数据
 * @param item
 */
function searchValueTransfer<T extends OperationLogRespDto.OperationLogSearchRespDto>(item: T): OperationLogRespDto.OperationLogInfoRespDto {
  return {
    createTime: item.createTime,
    duration: item.duration,
    id: item.id,
    operationMethod: item.operationMethod,
    operationModule: item._formatted.operationModule,
    operationName: item._formatted.operationName,
    status: item.status,
    userId: item.userId
  };
}


/**
 * @description 导出操作日志文件
 */
function operationLogFileExport() {
  const href: string = OPERATION_LOG_REQUEST_HOST + '/export' + '/' +  getUserId();
  // 创建一个 a 标签，模拟点击
  const a = document.createElement('a');
  a.href = href;
  a.click();
}
/** ========= 操作日志初始化-end ==========**/



onMounted(() => {
  isLoading.value = true;
  pageOperationLogList();
  isLoading.value = false;
});
</script>

<template>
  <ManageLayout
    header="操作日志"
  >
    <template #default>
      <div class="w-full h-full flex flex-col pt-4">
        <!-- header -->
        <div
          v-if="showHeader"
          class="w-full h-auto flex items-center justify-between"
        >
          <el-form-item
            label="搜索"
            required
            inline-message
          >
            <el-input
              v-model="searchQuery"
              clearable
              placeholder="请输入查询条件,包括操作名称，路径，方法"
              style="width: 300px;"
              @keydown.enter="blurSearch"
              @clear="refreshPage"
            />
          </el-form-item>
          <el-button @click="blurSearch" type="primary">搜索</el-button>
        </div>
        <!-- functional banner -->
        <div class="w-full h-auto grid grid-cols-2 gap-4 mb-4">
          <div class="w-full h-auto flex items-center">
            <el-button @click="operationLogFileExport" type="success" plain icon="Upload">导出</el-button>
          </div>
          <div class="w-full h-auto flex items-center justify-end">
            <el-button size="small" @click="() => showHeader = !showHeader" icon="Search" circle plain type="primary" />
            <el-button size="small" @click="refreshPage" icon="Refresh" circle plain type="info" />
            <el-button size="small" icon="Operation" circle plain type="warning" />
          </div>
        </div>
        <!-- table-body -->
        <div class="w-full h-auto flex flex-col">
          <el-table
            v-loading="isLoading"
            :data="tableData"
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
              label="操作名称"
              prop="operationName"
            >
              <template #default="{ row }">
                <div
                  v-html="row.operationName"
                  class="high-light"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作路径"
              width="400"
              prop="operationModule"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <div
                  v-html="row.operationModule"
                  class="high-light"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作方法"
              prop="operationMethod"
            >
              <template #default="{ row }">
                <div class="w-full h-auto flex items-center justify-center">
                  <el-tag
                    :type="$enum.OperationMethodTypeEnum[row.operationMethod]"
                    size="small"
                  >
                    {{ $enum.OperationMethodEnum[row.operationMethod] }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="用户id"
              prop="userId"
            />
            <el-table-column
              label="操作状态"
              prop="status"
            >
              <template #default="{ row }">
                <div class="w-full h-auto flex items-center justify-center">
                  <el-tag
                    size="small"
                    :type="$enum.OperationStatusTypeEnum[row.status]"
                  >
                    {{ row.status }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作时间"
              prop="createTime"
            >
              <template #default="{ row }">
                <span>
                  {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作耗时"
              prop="duration"
            >
              <template #default="{ row }">
                <span>{{ row.duration }} ms</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
              :fixed="'right'"
            >
              <template #default="{ row }">
                <div class="w-full h-auto flex items-center justify-center">
                  <el-button type="text">详情</el-button>
                </div>
              </template>
            </el-table-column>
            <template #empty>
              <el-empty
                description="暂无日志"
              />
            </template>
          </el-table>
        </div>
      </div>
    </template>
    <!-- pagination -->
    <template #footer>
      <div class="w-full h-full flex items-center justify-center">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="sizeOptions"
          :layout="pageLayout"
          :total="total"
          @change="changePage"
        />
      </div>
    </template>
  </ManageLayout>
</template>

<style scoped>
:deep(.high-light em) {
  color: red;
  font-weight: bold;
}
</style>
