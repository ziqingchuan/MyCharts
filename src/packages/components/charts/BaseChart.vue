<template>
  <div
      :id="computedId"
      :class="['base-chart', config.className]"
      :style="{
      width: config.width || '100%',
      height: config.height || '100%',
      ...config.style
    }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';
import type { BaseChartConfig } from '@/types';

const props = defineProps<{
  config: BaseChartConfig;
  autoResize?: boolean;
}>();

const chartInstance = ref<ECharts | null>(null);
const computedId = computed(() => props.config.id || `chart-${Date.now()}`);

// 初始化图表
const initChart = () => {
  // 先销毁已存在的实例
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }

  const dom = document.getElementById(computedId.value);
  if (dom) {
    chartInstance.value = echarts.init(dom);
  }
};

// 更新图表配置
const updateChart = (options: EChartsOption) => {
  if (chartInstance.value) {
    chartInstance.value.setOption(options, true);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};

// 生命周期钩子
onMounted(() => {
  initChart();
  if (props.autoResize) {
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
  window.removeEventListener('resize', handleResize);
});

// 监听配置变化，重新渲染图表
watch(
    () => props.config,
    () => {
      initChart();
    },
    { deep: true }
);

// 暴露方法给子组件
defineExpose({
  updateChart,
  chartInstance
});
</script>

<style scoped>
.base-chart {
  position: relative;
}
</style>
