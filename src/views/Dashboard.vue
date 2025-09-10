<template>
  <div class="dashboard-container">
    <h1>数据监控看板</h1>

    <div class="dashboard-grid">
      <!-- 折线图示例 -->
      <div class="dashboard-card">
        <LineChart :config="lineChartConfig" />
      </div>

      <!-- 饼图示例 -->
      <div class="dashboard-card">
        <PieChart :config="pieChartConfig" />
      </div>

      <!-- 柱图示例 -->
      <div class="dashboard-card">
        <BarChart :config="barChartConfig" />
      </div>

      <!-- 雷达图示例 -->
      <div class="dashboard-card">
        <RadarChart :config="radarChartConfig" />
      </div>

      <!-- 散点图示例 -->
      <div class="dashboard-card">
        <ScatterChart :config="scatterChartConfig" />
      </div>

      <!-- 仪表盘示例 -->
      <div class="dashboard-card">
        <GaugeChart :config="modernGaugeConfig" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LineChart, PieChart, BarChart, RadarChart, ScatterChart, GaugeChart } from "@packages";
import type { LineChartConfig, PieChartConfig, BarChartConfig, RadarChartConfig, ScatterChartConfig, GaugeChartConfig } from '@types';

// 折线图配置
const lineChartConfig = ref<LineChartConfig>({
  id: 'line-chart',
  title: '访问量趋势',
  subtitle: '近7天数据',
  height: '300px',
  color: ['#3498db', '#e74c3c'], // 自定义颜色

  // 显示图例并配置位置
  legend: {
    show: true,
    bottom: 0,
  },

  // 配置提示框 - 仅在鼠标悬浮到数据点时显示
  tooltip: {
    show: true,
    trigger: 'item', // 关键修改：改为item触发，只在数据点上显示
    triggerOn: 'mousemove', // 鼠标移动到数据点时触发
    axisPointer: {
      type: 'none' // 关闭轴线指示器，避免鼠标在轴上显示
    },
    // 自定义提示框内容格式
    formatter: function(params: any) {
      return `
        <div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
        <div style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${params.color}; margin-right: 5px;"></span>
          <span>${params.seriesName}: ${params.value} 次</span>
        </div>
      `;
    },
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.Index.vue)'
  },

  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value',
    name: '访问量'
  },
  series: [
    {
      name: '网站', // 系列名称（会显示在图例和提示框中）
      type: 'line',
      data: [1200, 1900, 1500, 2400, 2800, 3200, 3600],
      smooth: true,
      // 增强数据点交互体验
      symbol: 'circle', // 明确指定标记类型
      symbolSize: 8, // 增大数据点，更容易触发
      showSymbol: true, // 始终显示数据点
      emphasis: {
        symbolSize: 10, // 鼠标悬停时放大
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(52, 152, 219, 0.5)'
        }
      }
    },
    {
      name: 'APP', // 系列名称（会显示在图例和提示框中）
      type: 'line',
      data: [800, 1200, 1000, 1800, 2100, 2400, 2900],
      smooth: true,
      // 增强数据点交互体验
      symbol: 'circle',
      symbolSize: 8,
      showSymbol: true,
      emphasis: {
        symbolSize: 10,
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(231, 76, 60, 0.5)'
        }
      }
    }
  ]
});
// 饼图配置
const pieChartConfig = ref<PieChartConfig>({
  id: 'pie-chart',
  title: '用户来源分布',
  height: '300px',
  color: ['#8cb5e6', '#639cdf',
    '#2b7ad8', '#0056bf'],

  // 图例配置
  legend: {
    show: true,
    bottom: 0,
    itemWidth: 12, // 图例标记的宽度
    itemHeight: 12, // 图例标记的高度
    textStyle: {
      fontSize: 12, // 图例文字大小
      color: '#333' // 图例文字颜色
    },
    // 图例项之间的间距
    itemGap: 15
  },

  // 提示框配置
  tooltip: {
    show: true,
    trigger: 'item', // 饼图使用item触发
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 背景色
    borderColor: '#ddd', // 边框颜色
    borderWidth: 1, // 边框宽度
    padding: 10, // 内边距

    // 自定义提示框内容
    formatter: function(params: any) {
      // params包含数据名称、值、百分比等信息
      return `
        <div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
        <div>访问量: ${params.value} 次</div>
        <div>占比: ${params.percent.toFixed(1)}%</div>
      `;
    },
    // 提示框出现的动画延迟
    animationDelay: 100
  },

  series: [
    {
      type: 'pie',
      radius: '60%',
      center: ['50%', '50%'], // 饼图中心位置(左, 上)
      data: [
        { name: '直接访问', value: 35 },
        { name: '搜索引擎', value: 45 },
        { name: '社交媒体', value: 15 },
        { name: '外部链接', value: 5 }
      ],
      // 鼠标悬停时的高亮样式
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      // 饼图扇区是否可点击
      selectable: true,
      // 显示标签（扇区内的文字）
      label: {
        show: false,
        position: 'inside', // 标签显示在扇区内
        formatter: '{d}%', // 显示百分比
        fontSize: 12
      },
      // 连接线样式（当标签在外部时）
      labelLine: {
        show: false // 关闭连接线，因为标签在内部
      }
    }
  ]
});
// 柱状图配置
const barChartConfig = ref<BarChartConfig>({
  id: 'sales-bar-chart',
  title: '2023年产品销售额',
  subtitle: '单位：万元',
  width: '100%',
  height: '400px',
  // 自定义颜色配置
  color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],

  // 图例配置
  legend: {
    show: true,
    position: 'top',
    left: 'center',
    textStyle: {
      fontSize: 12
    }
  },

  // 提示框配置
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(0, 0, 0, 0.Index.vue)'
      }
    },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#ddd',
    borderWidth: 1,
    textStyle: {
      color: '#333'
    },
    formatter: function(params: any) {
      let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].name}</div>`;
      params.forEach((item: any) => {
        result += `
          <div style="display: flex; align-items: center; margin: 2px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 5px;"></span>
            <span>${item.seriesName}: ${item.value} 万元</span>
          </div>
        `;
      });
      return result;
    }
  },

  // X轴配置 - 解决超出右边界问题
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    name: '月份',
    axisLabel: {
      rotate: 30, // 保持旋转避免重叠
      interval: 0, // 强制显示所有标签
      margin: 15, // 增加标签与轴线的距离
      align: 'center' // 标签居中对齐
    },
    // 增加轴两边的留白
    boundaryGap: [0.1, 0.1]
  },

  // Y轴配置
  yAxis: {
    type: 'value',
    name: '销售额',
    axisLabel: {
      formatter: '{value}'
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },

  // 系列数据配置
  series: [
    {
      name: '产品A',
      type: 'bar',
      data: [120, 150, 180, 160, 200, 230],
      barWidth: '15%',
      barGap: '20%'
    },
    {
      name: '产品B',
      type: 'bar',
      data: [90, 110, 130, 150, 170, 190],
      barWidth: '15%'
    },
    {
      name: '产品C',
      type: 'bar',
      data: [80, 95, 102, 120, 140, 160],
      barWidth: '15%'
    },
    {
      name: '产品D',
      type: 'bar',
      data: [60, 75, 90, 110, 130, 150],
      barWidth: '15%'
    }
  ],

  // 网格配置 - 关键修复：增加右侧边距
  grid: {
    top: '18%',
    right: '8%', // 从5%增加到8%，给右侧留出更多空间
    bottom: '20%',
    left: '8%',
    containLabel: true // 确保标签被包含在网格内
  }
});
// 雷达图配置
const radarChartConfig = ref<RadarChartConfig>({
  id: 'radar-chart',
  title: '雷达图示例',
  color: ['#04cf15', '#00a6ff'],
  legend: {
    show: true,
    data: ['预算分配', '实际开销'], // 确保与 series.name 对应
  },
  radar: {
    shape: 'polygon',
    indicator: [
      { name: '销售', max: 100 },
      { name: '管理', max: 100 },
      { name: '信息技术', max: 100 },
      { name: '客服', max: 100 },
      { name: '研发', max: 100 },
      { name: '市场', max: 100 },
    ],
  },
  series: [
    {
      name: '预算分配', // 图例名称，与 legend 对应
      type: 'radar',
      data: [
        {
          name: '预算分配',
          value: [80, 90, 70, 85, 75, 95], // 数据值
        },
      ],
    },
    {
      name: '实际开销', // 图例名称，与 legend 对应
      type: 'radar',
      data: [
        {
          name: '实际开销',
          value: [60, 75, 90, 75, 40, 70], // 数据值
        },
      ],
    },
  ],
});
// 散点图配置
const scatterChartConfig = ref<ScatterChartConfig>({
  id: 'sales-scatter-chart',
  title: '产品价格与销量关系',
  subtitle: '不同类别产品分布',
  width: '100%',
  height: '400px',

  // 自定义颜色
  color: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'],

  // 图例配置
  legend: {
    show: true,
    position: 'top',
    left: 'center',
    textStyle: {
      fontSize: 12,
      color: '#666'
    }
  },

  // 提示框配置
  tooltip: {
    show: true,
    trigger: 'item',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    formatter: function(params: any) {
      return `
        <div style="font-weight: bold; margin-bottom: 5px;">${params.seriesName}</div>
        <div>产品: ${params.name || '未知'}</div>
        <div>价格: ${params.value[0]} 元</div>
        <div>销量: ${params.value[1]} 件</div>
      `;
    }
  },

  // X轴配置 (价格)
  xAxis: {
    type: 'value',
    name: '价格 (元)',
    nameLocation: 'middle',
    nameGap: 30,
    min: 0,
    max: 'dataMax',
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#f0f0f0'
      }
    }
  },

  // Y轴配置 (销量)
  yAxis: {
    type: 'value',
    name: '销量 (件)',
    nameLocation: 'middle',
    nameGap: 40,
    min: 0,
    max: 'dataMax',
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#f0f0f0'
      }
    }
  },

  // 网格配置
  grid: {
    top: '18%',
    right: '8%',
    bottom: '15%',
    left: '10%',
    containLabel: true
  },

  // 系列数据
  series: [
    {
      name: '电子产品',
      type: 'scatter',
      // 数据格式: [价格, 销量]
      data: [
        { value: [199, 1200], name: '耳机' },
        { value: [399, 850], name: '智能手表' },
        { value: [899, 620], name: '平板电脑' },
        { value: [1599, 480], name: '笔记本电脑' },
        { value: [2999, 320], name: '智能手机' }
      ],
      symbolSize: function(value: any) {
        // 根据销量动态调整点大小
        return Math.sqrt(value[1] / 10) + 5;
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(52, 152, 219, 0.5)'
        }
      }
    },
    {
      name: '家居用品',
      type: 'scatter',
      data: [
        { value: [89, 2100], name: '毛巾' },
        { value: [199, 1500], name: '被子' },
        { value: [349, 980], name: '枕头' },
        { value: [599, 650], name: '吸尘器' },
        { value: [899, 420], name: '空气净化器' }
      ],
      symbolSize: function(value: any) {
        return Math.sqrt(value[1] / 10) + 5;
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(231, 76, 60, 0.5)'
        }
      }
    },
    {
      name: '服装',
      type: 'scatter',
      data: [
        { value: [129, 3200], name: 'T恤' },
        { value: [259, 2800], name: '牛仔裤' },
        { value: [459, 1800], name: '运动鞋' },
        { value: [699, 1200], name: '外套' },
        { value: [999, 850], name: '羽绒服' }
      ],
      symbolSize: function(value: any) {
        return Math.sqrt(value[1] / 10) + 5;
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(46, 204, 113, 0.5)'
        }
      }
    }
  ]
});
// 仪表盘配置
const modernGaugeConfig = ref<GaugeChartConfig>({
  id: 'task-gauge',
  title: '任务完成度',
  subtitle: '截止当前',
  width: '100%',
  height: '400px',
  backgroundColor: 'transparent',

  // 提示框配置
  tooltip: {
    show: true,
    formatter: function(params: any) {
      return `
        <div style="font-weight: bold; margin-bottom: 5px;">当前进度：${params.value} %</div>
      `;
    },
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.Index.vue)'
  },

  // 系列配置 - 修复双层仪表盘对齐问题
  series: [
    // 底层主进度环
    {
      type: 'gauge',
      name: '进度',
      value: 65,
      min: 0,
      max: 100,
      splitNumber: 10,
      radius: '80%',
      center: ['50%', '70%'],
      startAngle: 220,
      endAngle: -40,
      // 主进度条样式
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#FFAB91' },
            { offset: 0.5, color: '#FFAB91' },
            { offset: 1, color: '#FFAB91' }
          ]
        }
      },

      // 进度显示
      progress: {
        show: true,
        width: 30,
        roundCap: false
      },

      // 隐藏指针
      pointer: {
        show: false
      },

      // 轴线样式
      axisLine: {
        lineStyle: {
          width: 30,
          color: [[1, 'rgba(230, 230, 230, 0.3)']] // 背景色
        }
      },

      // 小刻度
      axisTick: {
        distance: -45,
        splitNumber: 5,
        lineStyle: {
          width: 2,
          color: '#ddd'
        }
      },

      // 大刻度
      splitLine: {
        distance: -52,
        length: 14,
        lineStyle: {
          width: 3,
          color: '#bbb'
        }
      },

      // 刻度标签
      axisLabel: {
        distance: -20,
        color: '#888',
        fontSize: 16,
        formatter: '{value}'
      },

      // 隐藏中心锚点
      anchor: {
        show: false
      },

      // 隐藏标题
      title: {
        show: false
      },

      // 数值详情显示
      detail: {
        valueAnimation: true,
        width: '60%',
        lineHeight: 40,
        borderRadius: 8,
        offsetCenter: ['0', '-8%'],
        fontSize: 40,
        fontWeight: 'bolder',
        formatter: '{value} %',
        color: '#333',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: [10, 0]
      }
    },

    // 顶层高亮进度环 - 与底层保持完全一致的定位参数
    {
      type: 'gauge',
      name: '温度高亮',
      value: 65,
      // 关键修复：确保范围一致
      min: 0,
      max: 100,
      // 关键修复：确保尺寸和位置完全一致
      radius: '80%',
      center: ['50%', '70%'],
      startAngle: 220,
      endAngle: -40,

      // 高亮颜色
      itemStyle: {
        color: '#FD7347'
      },

      // 细进度条
      progress: {
        show: true,
        width: 8,
        roundCap: false
      },

      // 隐藏指针和轴线
      pointer: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: false },
      title: { show: false },
      detail: { show: false }
    }
  ]
});

</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.dashboard-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.dashboard-card h2 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #333;
}
</style>
