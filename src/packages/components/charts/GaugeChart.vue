<template>
  <div ref="chartContainer" :style="{ width: config.width || '100%', height: config.height || '400px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { GaugeChartConfig } from '@/types';
import type { EChartsOption, ECharts } from 'echarts';

// 仅保留必要属性
const props = defineProps<{
  config: GaugeChartConfig;
}>();

// 核心状态
const chartContainer = ref<HTMLDivElement>(null);
let chartInstance: ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (chartContainer.value && !chartInstance) {
    chartInstance = echarts.init(chartContainer.value);
  }
};

// 转换配置为ECharts选项
const getChartOptions = (): EChartsOption => {
  const { title, titleStyle, subtitle, subtitleStyle, tooltip, series, color, backgroundColor } = props.config;

  // 处理系列配置
  const processedSeries = series.map(s => ({
    type: 'gauge' as const,
    ...s,
    // 确保数据格式正确
    data: s.data || [{ value: s.value || 0 }]
  }));

  return {
    color,
    backgroundColor: backgroundColor || 'transparent',
    title: title ? {
      text: title,
      subtext: subtitle,
      left: 'center',
      top: 0,
      textStyle: titleStyle ? titleStyle : {color: 'black' },
      subtextStyle: subtitleStyle ? subtitleStyle : {color: 'black' },
    } : undefined,
    tooltip: tooltip === true ? {
      show: true,
      trigger: 'item'
    } : typeof tooltip === 'object' ? tooltip : { show: false },
    series: processedSeries,
    animation: true
  };
};

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(getChartOptions(), true);
  }
};

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    initChart();
    updateChart();
  });
});

// 监听配置变化
watch(
    () => props.config,
    () => {
      nextTick(() => {
        if (chartInstance) {
          chartInstance.clear();
        } else {
          initChart();
        }
        updateChart();
      });
    },
    { deep: true }
);

// 响应窗口大小变化
watch(
    () => [window.innerWidth, window.innerHeight],
    () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    }
);

// 组件卸载清理
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});

// 仅暴露必要方法
defineExpose({
  update: updateChart,
  getInstance: () => chartInstance
});
</script>

