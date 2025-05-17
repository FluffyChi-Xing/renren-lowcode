<script setup lang="ts">
import { ref, onMounted } from "vue";
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import {$api} from "@/componsables/api";
import {$message} from "@/componsables/element-plus";
import HighLightLang from "@/components/HighLightLang.vue";
import dayjs from "dayjs";
import tableHeaderConfig from '@/components/table-header-config.json';
import pageSizeOption from '@/components/pagination-size-options.json';
import { $util } from "@/componsables/utils";



/** ========== 异常日志初始化-start ==========**/
const searchValue = ref<string>('');
const isLoading = ref<boolean>(false);
const isShow = ref<boolean>(true);
const tableData = ref<ErrorLogRespDto.ErrorLogInfoRespDto[]>([]);
const total = ref<number>(0);
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const sizeOptions: number[] = $util.renren.jsonTypeTransfer<number[]>(pageSizeOption);


/**
 * @description 分页获取异常日志列表
 */
async function pageErrorLogList() {
  await $api.error.pageErrorLogInfoList(pageNum.value, pageSize.value)
    .then(res => {
      tableData.value = res.records;
      total.value = res.total;
    })
    .catch(_ => {
      $message({
        type: 'warning',
        message: '获取异常日志失败'
      });
    });
}


/**
 * @description 页面刷新
 */
async function refreshPage() {
  tableData.value = [];
  isLoading.value = true;
  await pageErrorLogList();
  isLoading.value = false;
}

/** ========== 异常日志初始化-end ==========**/




onMounted(async () => {
  isLoading.value = true;
  await pageErrorLogList();
  isLoading.value = false;
});
</script>

<template>
  <ManageLayout
    header="异常日志"
  >
    <template #default>
      <div class="w-full h-full flex flex-col pt-4">
        <!-- search-header -->
        <div
          v-if="isShow"
          class="w-full h-auto flex items-center justify-between"
        >
          <el-form-item label="搜索" required inline-message>
            <el-input
              v-model="searchValue"
              clearable
              placeholder="请输入关键字"
              style="width: 240px;"
            />
          </el-form-item>
          <el-button type="primary">搜索</el-button>
        </div>
        <!-- functional-banner -->
        <div class="w-full h-8 flex items-center justify-between">
          <el-button type="success" plain icon="Upload">导出</el-button>
          <div class="flex items-center">
            <el-button circle size="small" type="primary" plain icon="Search" @click="() => isShow = !isShow" />
            <el-button @click="refreshPage" circle size="small" type="info" plain icon="Refresh" />
            <el-button circle size="small" type="warning" plain icon="Operation" />
          </div>
        </div>
        <!-- table-body -->
        <div class="w-full h-auto flex flex-col mt-4">
          <el-table
            v-loading="isLoading"
            :data="tableData"
            stripe
            border
            fit
            :header-cell-style="tableHeaderConfig"
            class="h-full"
            style="width: 100%;"
          >
            <el-table-column
              label="id"
              prop="id"
            />
            <el-table-column
              label="信息"
              prop="message"
              width="150"
            />
            <el-table-column
              label="源"
              prop="source"
              width="150"
              show-overflow-tooltip
            />
            <el-table-column
              label="所在行"
              prop="lineno"
            >
              <template #default="{ row }">
                <span>{{ row.lineno ? row.lineno : 'null' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="所在列"
              prop="colno"
            >
              <template #default="{ row }">
                <span>{{ row.colno ? row.colno : 'null' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              type="expand"
              label="异常详情"
              width="100"
            >
              <template #default="{ row }">
                <div class="w-full h-auto flex p-4">
                  <high-light-lang
                    :height="200"
                    :code="row.error"
                    lang="javascript"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="页面帧数"
              prop="frame"
            >
              <template #default="{ row }">
                <span>{{ row.frame ? row.frame : 'null' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="ip"
              prop="ip"
            />
            <el-table-column
              label="网络状态"
              prop="network"
            />
            <el-table-column
              label="浏览器类型"
              prop="browser"
            />
            <el-table-column
              label="操作系统类型"
              prop="os"
            />
            <el-table-column
              label="用户id"
              prop="userId"
            />
            <el-table-column
              label="项目id"
              prop="projectId"
            />
            <el-table-column
              label="页面id"
              prop="documentId"
            />
            <el-table-column
              label="上报时间"
              prop="createTime"
            >
              <template #default="{ row }">
                <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
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
                description="暂无异常日志"
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
