<template>
  <div ref="chartContainer" :style="{ width: config.width || '100%', height: config.height || '400px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import type { BarChartConfig } from '@types';
import type { ECharts } from 'echarts';

const props = defineProps<{
  config: BarChartConfig;
}>();

const chartContainer = ref<HTMLDivElement>();
let chartInstance: ECharts | null = null;
const legendSelected = ref<Record<string, boolean>>({});

// 定义默认的颜色数组
const defaultColors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666',
  '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
  '#ea7ccc', '#56ccf2', '#2ecc71', '#f1c40f',
  '#e74c3c', '#9b59b6', '#1abc9c', '#3498db'
];

// 初始化图表
const initChart = () => {
  if (chartContainer.value && !chartInstance) {
    chartInstance = echarts.init(chartContainer.value);
    bindChartEvents();
  }
};

// 绑定图表事件
const bindChartEvents = () => {
  if (!chartInstance) return;

  // 解绑已有事件，避免重复绑定
  chartInstance.off('legendselectchanged');
  chartInstance.off('mouseover');

  // 图例选择事件
  chartInstance.on('legendselectchanged', (params: any) => {
    legendSelected.value = { ...params.selected };
    updateChart();
  });

  // 鼠标悬停事件，确保tooltip显示
  chartInstance.on('mouseover', (params: any) => {
    if (params.componentType === 'series' && chartInstance) {
      chartInstance.dispatchAction({
        type: 'showTip',
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex
      });
    }
  });
};

// 获取图表配置
const getChartOptions = (): any => {
  const { title, titleStyle, subtitle, subtitleStyle, legend, tooltip, xAxis, yAxis, series, grid, color } = props.config;

  // 处理颜色
  const chartColors = Array.isArray(color) ? color : color ? [color] : defaultColors;

  // 初始化图例选中状态
  if (series && Object.keys(legendSelected.value).length === 0) {
    series.forEach((s: any) => {
      legendSelected.value[s.name || `series-${series.indexOf(s)}`] = true;
    });
  }

  // 基础坐标系配置 - 强制存在
  const baseXAxis = {
    id: 'xAxis',
    type: 'category' as const,
    boundaryGap: true,
    data: [] as string[],
    axisTick: {
      alignWithLabel: true
    }
  };

  const baseYAxis = {
    id: 'yAxis',
    type: 'value' as const,
    name: '数值'
  };

  // 合并用户配置与基础配置
  const finalXAxis = { ...baseXAxis, ...xAxis };
  const finalYAxis = { ...baseYAxis, ...yAxis };

  // 图例配置
  const legendConfig = legend === true ? {
    show: true,
    position: 'top',
    left: 'center',
    data: series?.map((s: any) => s.name),
    selected: legendSelected.value
  } : typeof legend === 'object' ? {
    show: true,
    ...legend,
    data: legend.data || series?.map((s: any) => s.name),
    selected: legendSelected.value
  } : {
    show: false
  };

  // 提示框配置 - 确保可用
  const tooltipConfig = {
    show: true,
    trigger: 'axis' as const,
    axisPointer: {
      type: 'shadow' as const,
      z: 100
    },
    ...(typeof tooltip === 'object' ? tooltip : {})
  };

  // 系列配置
  const processedSeries = series ? series.map((s: any, index: any) => ({
    ...s,
    type: 'bar' as const,
    // 强制绑定坐标系
    coordinateSystem: 'cartesian2d',
    xAxisIndex: 0,
    yAxisIndex: 0,
    id: `series-${index}`,
    name: s.name || `系列${index + 1}`,
    data: s.data || [],
    itemStyle: {
      ...s.itemStyle,
      color: s.itemStyle?.color || chartColors[index % chartColors.length]
    },
    barWidth: s.barWidth || '60%',
    barGap: s.barGap || '20%'
  })) : [];

  return {
    backgroundColor: 'transparent',
    color: chartColors,
    title: title ? {
      text: title,
      subtext: subtitle,
      left: 'center',
      top: 0,
      textStyle: titleStyle ? titleStyle : {color: 'black' },
      subtextStyle: subtitleStyle ? subtitleStyle : {color: 'black' },
    } : undefined,
    legend: legendConfig,
    tooltip: tooltipConfig,
    grid: {
      top: '15%',
      right: '5%',
      bottom: '15%',
      left: '8%',
      containLabel: true,
      ...grid
    },
    // 明确的坐标系配置
    xAxis: finalXAxis,
    yAxis: finalYAxis,
    series: processedSeries,
    animation: true,
    animationDuration: 500
  };
};

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    const option = getChartOptions();
    chartInstance.setOption(option, true);
  }
};

// 生命周期
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
        // 配置变化时重新初始化坐标系
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
</script>
