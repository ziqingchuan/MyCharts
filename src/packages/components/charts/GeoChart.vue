<template>
  <div
      ref="chartContainer"
      :class="['geo-chart-container', config.className]"
      :style="{
      width: config.width || '100%',
      height: config.height || '500px',
      ...config.style
    }"
  />
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import type {ECharts, EChartsOption} from 'echarts';
import { GeoChartConfig } from '@/types';
import * as echarts from 'echarts';

// 固定颜色数组，用于渲染系列数据
const fixedColors = [
  '#38bdf8', '#0284c7', '#0369a1', '#075985',
  '#0c4a6e', '#0f766e', '#059669', '#10b981',
  '#34d399', '#6ee7b7', '#a7f3d0', '#dcfce7'
];

// 组件属性定义
const props = defineProps<{
  config: GeoChartConfig;
  autoResize?: boolean;
}>();

// 组件内部状态
const chartContainer = ref<HTMLDivElement | null>(null);
const chartInstance = ref<ECharts | null>(null);
const mapComponents = ref<Record<string, any>>({});

// 计算最终有效的配置
const effectiveConfig = computed(() => {
  const baseConfig = { ...props.config };

  if (baseConfig.geo) {
    baseConfig.map = baseConfig.geo.map || baseConfig.map;
    baseConfig.roam = baseConfig.geo.roam !== undefined
        ? baseConfig.geo.roam
        : baseConfig.roam;
    baseConfig.label = baseConfig.geo.label || baseConfig.label;
  }

  console.log('>>> 有效配置:', {
    map: baseConfig.map,
    hasSeries: !!baseConfig.series && baseConfig.series.length > 0,
    seriesTypes: baseConfig.series?.map(s => s.type)
  });

  return baseConfig;
});

// 注册地图
const registerMap = async (mapName: string) => {
  console.log(`>>> 尝试注册地图: ${mapName}`);
  if (mapComponents.value[mapName]) {
    console.log(`>>> 地图 ${mapName} 已注册`);
    return true;
  }

  try {
    let mapData;
    switch (mapName) {
      case 'china':
        console.log(`>>> 加载中国地图数据`);
        mapData = await import('echarts-map/json/china.json');
        break;
      case 'world':
        console.log(`>>> 加载世界地图数据`);
        mapData = await import('echarts-map/json/world.json');
        break;
      default:
        console.warn(`>>> 地图类型 ${mapName} 暂不支持`);
        return false;
    }

    echarts.registerMap(mapName, mapData.default || mapData);
    mapComponents.value[mapName] = true;
    console.log(`>>> 地图 ${mapName} 注册成功`);
    return true;
  } catch (error) {
    console.error(`>>> 注册地图 ${mapName} 失败:`, error);
    return false;
  }
};

// 初始化图表
const initChart = async () => {
  console.log('>>> 开始初始化图表');
  if (!chartContainer.value) {
    console.error('>>> 图表容器不存在');
    return;
  }

  if (chartInstance.value) {
    console.log('>>> 销毁已有图表实例');
    chartInstance.value.dispose();
  }

  chartInstance.value = echarts.init(chartContainer.value, undefined, {
    renderer: 'canvas',
    useDirtyRect: true
  });

  const mapName = effectiveConfig.value.map || 'china';
  console.log(`>>> 准备注册地图: ${mapName}`);
  const registerSuccess = await registerMap(mapName);
  if (!registerSuccess) {
    console.error(`>>> 地图 ${mapName} 注册失败`);
    return;
  }

  console.log('>>> 初始化完成，开始更新图表');
  updateChart();
};

// 获取固定颜色
const getFixedColor = (index: number) => {
  const color = fixedColors[index % fixedColors.length];
  console.log(`>>> 获取固定颜色 [索引: ${index}] => ${color}`);
  return color;
};

// 准备图表配置项 - 关键修复：地图使用areaColor
const prepareChartOption = (): EChartsOption => {
  console.log('>>> 开始准备图表配置项');
  const { map: mapName, geo, label, roam, series, title, tooltip, color } = effectiveConfig.value;

  return {
    title: title || {},
    tooltip: tooltip || {
      trigger: 'item',
      formatter: (params: any) => {
        if (!params.name) return '';
        let valueStr = '';
        if (Array.isArray(params.value) && params.value.length >= 3) {
          valueStr = `值: ${params.value[2]}`;
        } else if (typeof params.value === 'number') {
          valueStr = `值: ${params.value}`;
        }
        return `${params.name}<br/>${valueStr}`;
      }
    },
    geo: {
      map: mapName,
      roam: roam ?? false,
      label: {
        show: true,
        ...label
      },
      zoom: 1,
      ...geo
    },
    series: series?.map((s, seriesIndex) => {
      console.log(`>>> 处理系列 [索引: ${seriesIndex}]，类型: ${s.type}`);

      const seriesColor = color || getFixedColor(seriesIndex);
      console.log(`>>> 系列 [${seriesIndex}] 基础颜色: ${seriesColor}`);

      const baseSeriesConfig: any = {
        name: s.name,
        type: s.type,
        data: s.data,
        geoIndex: 0,
        // 关键修复：地图类型使用areaColor，其他类型使用color
        itemStyle: s.type !== 'map' ? {
          color: seriesColor, // 非地图类型用color
          ...s.itemStyle
        } : {
          areaColor: seriesColor, // 地图类型必须用areaColor
          ...s.itemStyle
        },
        symbolSize: s.symbolSize || 10,
        ...s
      };

      if (s.type === 'map') {
        baseSeriesConfig.map = s.map || mapName;

        // 高亮样式保持用areaColor
        baseSeriesConfig.emphasis = {
          ...s.emphasis,
          itemStyle: {
            ...(s.emphasis?.itemStyle || {}),
            areaColor: s.emphasis?.itemStyle?.areaColor || '#ff7d00' // 确保高亮用areaColor
          }
        };

        console.log(`>>> 地图系列配置:`, {
          map: baseSeriesConfig.map,
          baseAreaColor: baseSeriesConfig.itemStyle?.areaColor, // 现在监测areaColor
          hasEmphasis: !!baseSeriesConfig.emphasis,
          emphasisAreaColor: baseSeriesConfig.emphasis?.itemStyle?.areaColor
        });
      }

      if (s.data && s.data.length > 0) {
        console.log(`>>> 处理系列 [${seriesIndex}] 的数据项，共 ${s.data.length} 项`);
        baseSeriesConfig.data = s.data.map((item: any, itemIndex: number) => {
          const colorIndex = seriesIndex * 10 + itemIndex;
          const itemColor = getFixedColor(colorIndex);

          console.log(`>>> 数据项 [${itemIndex}] ${item.name} 颜色: ${itemColor}`);

          return {
            ...item,
            itemStyle: s.type !== 'map' ? {
              color: itemColor, // 非地图数据项用color
              ...item.itemStyle
            } : {
              areaColor: itemColor, // 地图数据项必须用areaColor
              ...item.itemStyle
            }
          };
        });
      }

      return baseSeriesConfig;
    })
  };
};

// 更新图表
const updateChart = () => {
  console.log('>>> 开始更新图表');
  if (!chartInstance.value) {
    console.error('>>> 图表实例不存在');
    return;
  }

  const option = prepareChartOption();
  console.log('>>> 应用图表配置项');
  chartInstance.value.setOption(option, {
    notMerge: true,
    replaceMerge: ['series', 'geo']
  });

  const currentOption = chartInstance.value.getOption();
  console.log('>>> 图表当前实际配置:', {
    firstSeriesAreaColor: currentOption.series?.[0]?.itemStyle?.areaColor,
    firstSeriesEmphasis: currentOption.series?.[0]?.emphasis
  });
};

// 处理窗口大小变化
const handleResize = () => {
  console.log('>>> 调整图表尺寸');
  chartInstance.value?.resize();
};

// 生命周期钩子
onMounted(() => {
  console.log('>>> 组件挂载完成');
  nextTick(() => {
    initChart();
    if (props.autoResize) {
      window.addEventListener('resize', handleResize);
    }
  });
});

onUnmounted(() => {
  console.log('>>> 组件卸载');
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  window.removeEventListener('resize', handleResize);
});

// 监听配置变化
watch(
    () => props.config,
    () => {
      console.log('>>> 配置变化，更新图表');
      nextTick(() => updateChart());
    },
    { deep: true }
);

// 暴露方法
defineExpose({
  updateChart,
  getInstance: () => chartInstance.value,
  resize: handleResize
});
</script>

<style scoped>
.geo-chart-container {
  position: relative;
  overflow: hidden;
}
</style>
