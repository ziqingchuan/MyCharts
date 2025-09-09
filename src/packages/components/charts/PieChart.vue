<template>
  <BaseChart ref="baseChartRef" :config="config" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import BaseChart from './BaseChart.vue';
import type { PieChartConfig } from '@/types';
import type { EChartsOption } from 'echarts';

const props = defineProps<{
  config: PieChartConfig;
}>();

const baseChartRef = ref<any>(null);

// 定义默认的颜色数组
const defaultColors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666',
  '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
  '#ea7ccc', '#56ccf2', '#2ecc71', '#f1c40f',
  '#e74c3c', '#9b59b6', '#1abc9c', '#3498db'
];

// 转换配置为ECharts选项
const getChartOptions = (): EChartsOption => {
  const { title, subtitle, legend, tooltip, series, color } = props.config;

  // 优先使用config中的color，否则使用默认颜色
  // 处理color可能是单个颜色或颜色数组的情况
  const chartColors = Array.isArray(color)
      ? color
      : color
          ? [color]
          : defaultColors;

  return {
    color: chartColors, // 全局颜色配置
    title: title ? {
      text: title,
      subtext: subtitle,
      left: 'center',
      top: 0,
    } : undefined,
    legend: legend ? (typeof legend === 'object' ? legend : {
      show: true,
      position: 'right'
    }) : { show: false },
    tooltip: tooltip ? (typeof tooltip === 'object' ? tooltip : {
      show: true,
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    }) : { show: false },
    series: series ?
        series.map(s => ({
          ...s,
          type: 'pie',
          // 确保使用统一的颜色配置
          itemStyle: {
            ...s.itemStyle,
            color: function(params) {
              return chartColors[params.dataIndex % chartColors.length];
            }
          }
        })) :
        [{
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          data: [],
          itemStyle: {
            color: function(params) {
              return chartColors[params.dataIndex % chartColors.length];
            }
          }
        }]
  };
};

// 更新图表
const updatePieChart = () => {
  if (baseChartRef.value) {
    baseChartRef.value.updateChart(getChartOptions());
  }
};

onMounted(() => {
  updatePieChart();
});

// 监听配置变化（包括颜色变化）
watch(
    () => props.config,
    () => {
      updatePieChart();
    },
    { deep: true }
);
</script>
