<script setup lang="ts">
import {ref, reactive, onMounted, watch} from 'vue';
import * as echarts from 'echarts';



const props = withDefaults(defineProps<{
  xAxis?: string[];
  data?: string[] | number[];
}>(), {
  xAxis: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: () => [820, 932, 901, 934, 1290, 1330, 1320]
});
const chart = ref();
const myChart = ref<echarts.EChartsType>(); // chart 实例
const option = reactive({
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.xAxis,
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: props.data,
      type: 'line',
      areaStyle: {}
    }
  ],
  tooltip: {
    trigger: 'axis',
  }
});


/**
 * @description 初始化图表
 */
function initChart() {
  if (chart.value) {
    myChart.value = echarts.init(chart.value);
    myChart.value.setOption(option);
  }
}


/**
 * @description 刷新图表数据
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

window.addEventListener('resize', () => {
  initChart();
});
</script>

<template>
  <div ref="chart" class="w-full h-full flex" />
</template>

<style scoped>

</style>
