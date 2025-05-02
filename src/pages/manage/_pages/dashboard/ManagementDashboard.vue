<script setup lang="ts">
import { ref } from 'vue';
import ManageLayout from "@/pages/manage/_component/ManageLayout.vue";
import type {RenrenInterface} from "@/componsables/interface/RenrenInterface";
import Statistic from "@/components/Statistic.vue";
import RecentlyProjectCreationChart from "@/pages/manage/_pages/dashboard/_component/RecentlyProjectCreationChart.vue";
import RecentlyPageCreationChart from "@/pages/manage/_pages/dashboard/_component/RecentlyPageCreationChart.vue";



/** ========== 统计卡片初始化-start ==========**/
const loadingStatistic = ref<boolean>(false);
const statisticCardList = ref<RenrenInterface.keyValueType<string>[]>([
  {
    key: '基础物料总数',
    value: '5',
  },
  {
    key: '自定义物料总数',
    value: '3',
  },
  {
    key: '个人最大自定义物料数',
    value: '20',
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
  <ManageLayout :footer="false" header="仪表盘">
    <template #default>
      <div class="w-full h-full flex flex-col pt-4">
        <!-- 统计卡片 -->
        <div class="w-full h-28 grid grid-cols-3 gap-4">
          <Statistic
            v-for="(item, index) in statisticCardList"
            :key="index"
            :title="item.key"
            :value="item.value"
            :loading="loadingStatistic"
          />
        </div>
        <!-- 统计图 -->
        <div style="height: calc(100% - 112px);" class="w-full pt-4 grid grid-cols-2 gap-4">
          <!-- 最近项目创建数量 -->
          <div class="w-full h-full flex flex-col">
            <!-- 时间段选择 -->
            <div class="w-full h-8 flex items-center justify-between">
              <span class="text-black font-bold">最近项目创建数</span>
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
          </div>
          <!-- 最近页面创建数量 -->
          <div class="w-full h-full flex flex-col">
            <div class="w-full h-8 flex items-center justify-between">
              <span class="text-black font-bold">最近页面创建数</span>
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
          </div>
        </div>
      </div>
    </template>
  </ManageLayout>
</template>

<style scoped>

</style>
