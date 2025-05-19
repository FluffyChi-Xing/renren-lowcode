<script setup lang="ts">
import {onMounted, ref} from 'vue';
import Statistic from "@/components/Statistic.vue";
import RecentlyProjectCreationChart from "@/pages/manage/_pages/dashboard/_component/RecentlyProjectCreationChart.vue";
import RecentlyPageCreationChart from "@/pages/manage/_pages/dashboard/_component/RecentlyPageCreationChart.vue";
import {$util} from "@/componsables/utils";
import mock from './statistic-mock.json';
import {$engine} from "@/renren-engine/engine";



/** ========== 统计卡片初始化-start ==========**/
const loadingStatistic = ref<boolean>(false);
const statisticCardList = ref<RenrenInterface.keyValueType<number>[]>(
  $util.renren.jsonTypeTransfer<RenrenInterface.keyValueType<number>[]>(mock)
);
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


onMounted(async () => {
  await $engine.codeGenerator.getCodeTemplate().then(res => {
    console.log(res);
  }).catch(err => {
    console.error(err);
  });
});
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
          <el-card class="w-full h-[400px]">
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
          <el-card class="w-full h-[400px]">
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
