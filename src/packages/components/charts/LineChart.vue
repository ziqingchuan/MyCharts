<template>
  <div ref="chartContainer" :style="{ width: config.width || '100%', height: config.height || '400px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import type { LineChartConfig } from '@/types';
import type { EChartsOption, ECharts } from 'echarts';

const props = defineProps<{
  config: LineChartConfig;
}>();

const chartContainer = ref<HTMLDivElement>(null);
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

  // 解绑已有事件
  chartInstance.off('legendselectchanged');
  chartInstance.off('mouseover');

  // 图例选择事件
  chartInstance.on('legendselectchanged', (params: any) => {
    legendSelected.value = { ...params.selected };
    updateChart();
  });

  // 确保tooltip显示
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

// 创建基础坐标系配置
const createCartesianCoordinate = () => ({
  xAxis: {
    id: 'xAxis',
    type: 'category' as const,
    boundaryGap: false,
    data: [],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    id: 'yAxis',
    type: 'value' as const,
    name: '数值'
  }
});

// 转换配置为ECharts选项
const getChartOptions = (): EChartsOption => {
  const { title, subtitle, legend, tooltip, xAxis, yAxis, series, grid, color } = props.config;
  const { xAxis: defaultX, yAxis: defaultY } = createCartesianCoordinate();

  // 处理颜色配置
  const chartColors = Array.isArray(color)
      ? color
      : color
          ? [color]
          : defaultColors;

  // 初始化图例选中状态
  if (series && Object.keys(legendSelected.value).length === 0) {
    series.forEach(s => {
      legendSelected.value[s.name || `series-${series.indexOf(s)}`] = true;
    });
  }

  // 处理图例配置
  const legendConfig = legend === true ? {
    show: true,
    position: 'top',
    left: 'center',
    data: series?.map(s => s.name),
    selected: legendSelected.value
  } : typeof legend === 'object' ? {
    show: true,
    ...legend,
    data: legend.data || series?.map(s => s.name),
    selected: legendSelected.value
  } : {
    show: false
  };

  // 处理提示框配置
  const tooltipConfig = tooltip === true ? {
    show: true,
    trigger: 'axis' as const,
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    },
    alwaysShowContent: false,
    useUTC: false
  } : typeof tooltip === 'object' ? {
    show: true,
    trigger: tooltip.trigger || 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      },
      ...tooltip.axisPointer
    },
    alwaysShowContent: false,
    useUTC: false,
    ...tooltip
  } : {
    show: true
  };

  // 处理系列数据 - 关键修复：明确绑定坐标系
  const processedSeries = series ? series.map((s, index) => ({
    ...s,
    type: 'line' as const,
    coordinateSystem: 'cartesian2d', // 显式指定坐标系
    xAxisIndex: 0, // 绑定到x轴
    yAxisIndex: 0, // 绑定到y轴
    id: `series-${index}`, // 唯一标识
    symbol: s.symbol || 'circle',
    symbolSize: s.symbolSize || 6,
    showSymbol: s.showSymbol !== undefined ? s.showSymbol : true,
    lineStyle: {
      ...s.lineStyle,
      color: s.lineStyle?.color || chartColors[index % chartColors.length]
    },
    itemStyle: {
      ...s.itemStyle,
      color: s.itemStyle?.color || chartColors[index % chartColors.length]
    },
    areaStyle: s.areaStyle ? {
      ...s.areaStyle,
      color: s.areaStyle.color || chartColors[index % chartColors.length]
    } : s.areaStyle
  })) : [];

  return {
    // 坐标系配置优先
    xAxis: { ...defaultX, ...xAxis },
    yAxis: { ...defaultY, ...yAxis },
    color: chartColors,
    title: title ? {
      text: title,
      subtext: subtitle,
      left: 'center',
      top: 0,
    } : undefined,
    legend: legendConfig,
    tooltip: tooltipConfig,
    grid: {
      top: '15%',
      right: '5%',
      bottom: '10%',
      left: '8%',
      containLabel: true,
      ...grid,
      // 显式关联网格与坐标轴
      xAxisIndex: 0,
      yAxisIndex: 0
    },
    series: processedSeries,
    animation: true,
    animationDuration: 300,
    animationEasingUpdate: 'quinticInOut'
  };
};

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    const option = getChartOptions();
    chartInstance.setOption(option, true);
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
        // 配置变化时先清空再更新，避免状态残留
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
