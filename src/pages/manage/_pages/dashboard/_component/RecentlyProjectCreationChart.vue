<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue';
import * as echarts from 'echarts';



const props = withDefaults(defineProps<{
  data?: string[] | number[];
  xAxis?: string[];
}>(), {
  xAxis: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: () => [820, 932, 901, 934, 1290, 1330, 1320],
});
const chart = ref();
const myChart = ref<echarts.EChartsType>();
const option = reactive({
  xAxis: {
    type: 'category',
    data: props.xAxis
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: props.data,
      type: 'line',
      smooth: true
    }
  ],
  tooltip: {
    trigger: 'axis'
  }
});


/**
 * @description 初始化统计图
 */
function initChart() {
  if (chart.value) {
    myChart.value = echarts.init(chart.value);
    myChart.value.setOption(option);
  }
}


/**
 * @description 刷新统计图
 */
function refreshChart() {
  if (myChart.value && chart.value) {
    myChart.value.setOption(option);
  }
}


onMounted(() => {
  initChart();
});


watch(() => props.data, () => {
  refreshChart();
});


/**
 * @description 处理窗口尺寸变化事件
 */
window.addEventListener('resize', () => {
  initChart();
});
</script>

<template>
  <!-- 最近项目创建情况 -->
  <div ref="chart" class="w-full h-full flex" />
</template>

<style scoped>

</style>
