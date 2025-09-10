<template>
  <BaseChart ref="baseChartRef" :config="config" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import BaseChart from './BaseChart.vue';
import type { RadarChartConfig } from '@types';

const props = defineProps<{
  config: RadarChartConfig;
}>();

const baseChartRef = ref<any>(null);

// 定义默认的颜色数组
const defaultColors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666',
  '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
  '#ea7ccc', '#56ccf2', '#2ecc71', '#f1c40f',
  '#e74c3c', '#9b59b6', '#1abc9c', '#3498db'
];

// 转换配置为 ECharts 选项
const getChartOptions = (): any => {
  const { title, titleStyle, subtitle, subtitleStyle, legend, radar, series, color, tooltip } = props.config;

  // 处理颜色配置，支持单个颜色或颜色数组
  const chartColors = Array.isArray(color)
      ? color
      : color
          ? [color]
          : defaultColors;

  return {
    color: chartColors, // 使用配置的颜色方案
    title: title ? {
      text: title,
      subtext: subtitle,
      left: 'center',
      top: 0,
      textStyle: titleStyle ? titleStyle : {color: 'black' },
      subtextStyle: subtitleStyle ? subtitleStyle : {color: 'black' },
    } : undefined,
    legend: legend ? {
      ...(legend && typeof legend === 'object' ? legend : {}), // 更安全的展开方式
      data: series?.map((s: any) => s.name),
      selected: series?.reduce((acc: any, s: any) => {
        acc[s.name] = true;
        return acc;
      }, {} as Record<string, boolean>),
    } : { show: false },
    radar: radar || {
      shape: 'polygon',
      indicator: [],
    },
    series: series ? series.map((s: any, index: any) => ({
      ...s,
      type: 'radar',
      name: s.name,
      seriesIndex: index,
      // 为每个系列指定颜色，循环使用配置的颜色
      itemStyle: {
        ...s.itemStyle,
        color: chartColors[index % chartColors.length]
      },
      lineStyle: {
        ...s.lineStyle,
        color: chartColors[index % chartColors.length]
      },
      areaStyle: {
        ...s.areaStyle,
        color: chartColors[index % chartColors.length],
        opacity: s.areaStyle?.opacity ?? 0.3 // 保留原有透明度或使用默认值
      }
    })) : [],
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const { seriesName, value } = params;
        const indicators = radar?.indicator || [];

        let html = `<div style="font-weight: bold; margin-bottom: 5px;">${seriesName}</div>`;

        value.forEach((v: number, i: number) => {
          const dimName = indicators[i]?.name || `维度 ${i + 1}`;
          html += `
        <div style="display: flex; justify-content: space-between;">
          <span>${dimName}:</span>
          <span style="font-weight: bold; color: ${chartColors[params.seriesIndex % chartColors.length]}">
            ${v}
          </span>
        </div>
      `;
        });

        return html;
      },
      ...(tooltip && typeof tooltip === 'object' ? tooltip : {}) // 更安全的展开方式
    },
    // 添加动画效果
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };
};

// 更新图表
const updateRadarChart = () => {
  if (baseChartRef.value) {
    baseChartRef.value.updateChart(getChartOptions());
  }
};

// 生命周期钩子
onMounted(() => {
  updateRadarChart();
});

// 监听配置变化（包括颜色变化）
watch(
    () => props.config,
    () => {
      updateRadarChart();
    },
    { deep: true }
);
</script>

