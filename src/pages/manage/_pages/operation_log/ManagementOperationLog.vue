<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import type {OperationLogRespDto} from "@/componsables/interface/dto/resp/OperationLogRespDto";
import {$api} from "@/componsables/api";
import {$message} from "@/componsables/element-plus";
import dayjs from "dayjs";
import {$enum} from "../../../../componsables/enum";


/** ========= 操作日志初始化-start ==========**/
const showHeader = ref<boolean>(true);
// 查询条件
const searchQuery = ref<string>('');
// 分页参数
const pageNum = ref<number>(0);
const pageSize = ref<number>(10);
const total = ref<number>(0);
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
      tableData.value = res.list;
    }).catch(_ => {
      $message({
        type: 'warning',
        message: '获取日志失败'
      });
  });
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
            label="查询"
            required
            inline-message
          >
            <el-input
              v-model="searchQuery"
              clearable
              placeholder="请输入查询条件,包括操作名称，路径，方法"
              style="width: 300px;"
            />
          </el-form-item>
          <el-button type="primary">确认</el-button>
        </div>
        <!-- functional banner -->
        <div class="w-full h-auto grid grid-cols-2 gap-4 mb-4">
          <div class="w-full h-auto flex items-center">
            <el-button type="success" plain icon="Download">导出</el-button>
          </div>
          <div class="w-full h-auto flex items-center justify-end">
            <el-button size="small" @click="() => showHeader = !showHeader" icon="Search" circle plain type="primary" />
            <el-button size="small" icon="Refresh" circle plain type="info" />
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
            />
            <el-table-column
              label="操作路径"
              prop="operationModule"
              show-overflow-tooltip
            />
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
      <div class="w-full h-full flex items-center justify-center bg-red-500" />
    </template>
  </ManageLayout>
</template>

<style scoped>

</style>
