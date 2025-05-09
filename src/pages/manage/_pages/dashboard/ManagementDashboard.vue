<script setup lang="ts">
import { ref } from 'vue';
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import Statistic from "@/components/Statistic.vue";
import RecentlyProjectCreationChart from "@/pages/manage/_pages/dashboard/_component/RecentlyProjectCreationChart.vue";
import RecentlyPageCreationChart from "@/pages/manage/_pages/dashboard/_component/RecentlyPageCreationChart.vue";



/** ========== 统计卡片初始化-start ==========**/
const loadingStatistic = ref<boolean>(false);
const statisticCardList = ref<RenrenInterface.keyValueType<number>[]>([
  {
    key: '基础物料总数',
    value: 5,
  },
  {
    key: '自定义物料总数',
    value: 3,
  },
  {
    key: '个人最大自定义物料数',
    value: 20,
  },
  {
    key: '项目创建数',
    value: 1
  },
  {
    key: '操作日志数',
    value: 215
  },
  {
    key: '创建页面数',
    value: 2
  }
]);
/** ========= 统计卡片初始化-end ==========**/



/** ========== 统计图初始化-start ==========**/
const timeSegment = ref<string>('0');
const timeSegmentOptions = ref<RenrenInterface.keyValueType<string>[]>([
  {
    key: '0',
    value: '最近七天'
  },
  {
    key: '1',
    value: '最近一个月'
  }
]);
/** ========= 统计图初始化-end ==========**/
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full h-full flex flex-col pt-4">
      <!-- 统计卡片 -->
      <div class="w-full h-28 grid grid-cols-6 gap-4">
        <Statistic
          v-for="(item, index) in statisticCardList"
          :key="index"
          :title="item.key"
          :value="item.value"
          :loading="loadingStatistic"
          :prefix="item.value >= 0 ? 'CaretTop' : 'CaretBottom'"
          :prefix-color="item.value >= 0 ? 'red' : 'green'"
        />
      </div>
      <!-- 统计图 -->
      <div class="w-full pt-4 grid grid-cols-2 gap-4">
        <!-- 最近项目创建数量 -->
        <div class="w-full h-full flex flex-col">
          <el-card class="w-full h-[300px]">
            <!-- 时间段选择 -->
            <div class="w-full h-8 flex items-center justify-between">
              <span class="chart-title">最近项目创建数</span>
              <el-select
                v-model="timeSegment"
                style="width: 200px;"
              >
                <el-option
                  v-for="(item, index) in timeSegmentOptions"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </div>
            <!-- chart -->
            <div style="height: calc(100% - 32px);" class="w-full h-auto flex">
              <RecentlyProjectCreationChart />
            </div>
          </el-card>
        </div>
        <!-- 最近页面创建数量 -->
        <div class="w-full h-full flex flex-col">
          <el-card class="w-full h-[300px]">
            <div class="w-full h-8 flex items-center justify-between">
              <span class="chart-title">最近页面创建数</span>
              <el-select
                v-model="timeSegment"
                style="width: 200px;"
              >
                <el-option
                  v-for="(item, index) in timeSegmentOptions"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </div>
            <!-- chart -->
            <div style="height: calc(100% - 32px);" class="w-full h-auto flex">
              <RecentlyPageCreationChart />
            </div>
          </el-card>
        </div>
        <!-- 最近异常日志统计图 -->
        <div class="w-full h-auto flex flex-col">
          <el-card class="w-full h-[300px]">

          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-card__body) {
  width: 100%;
  height: 100%;
}
</style>
