import type {
    LineChartConfig,
    PieChartConfig,
    BarChartConfig,
    RadarChartConfig,
    ScatterChartConfig,
    GaugeChartConfig
} from '@types';

import { ref } from 'vue';

// 科幻蓝色主题颜色配置
const sciFiColors = {
    primary: '#00b4ff',
    secondary: '#0088cc',
    accent: '#00ffcc',
    background: '#0a1929',
    cardBg: '#132f4c',
    text: '#c5c5c5',
    grid: 'rgba(0, 180, 255, 0.1)'
};

// 流量趋势配置
export const trafficConfig = ref<LineChartConfig>({
    id: 'traffic-trend',
    title: '流量趋势 - 最近24小时',
    height: '300px',
    color: [sciFiColors.primary, sciFiColors.accent],
    backgroundColor: sciFiColors.cardBg,
    titleStyle: {
        color: sciFiColors.text
    },
    legend: {
        show: true,
        textStyle: { color: sciFiColors.text },
        top: 10,
        left: '80%'
    },
    tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: sciFiColors.cardBg,
        borderColor: sciFiColors.primary,
        textStyle: { color: sciFiColors.text }
    },
    xAxis: {
        type: 'category',
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        axisLine: { lineStyle: { color: sciFiColors.grid } },
        axisLabel: { color: sciFiColors.text }
    },
    yAxis: {
        type: 'value',
        name: '访问量',
        axisLine: { lineStyle: { color: sciFiColors.text } },
        axisLabel: { color: sciFiColors.text },
        splitLine: { lineStyle: { color: sciFiColors.grid } }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        backgroundColor: sciFiColors.cardBg
    },
    series: [
        {
            name: '网站',
            type: 'line',
            data: [1200, 1800, 1500, 2200, 2800, 3200],
            smooth: true,
            lineStyle: { width: 3 },
            symbol: 'circle',
            symbolSize: 6
        },
        {
            name: '移动端',
            type: 'line',
            data: [800, 1200, 1000, 1600, 2100, 2500],
            smooth: true,
            lineStyle: { width: 3 },
            symbol: 'circle',
            symbolSize: 6
        }
    ]
});

// 用户来源分布配置
export const userSourceConfig = ref<PieChartConfig>({
    id: 'user-sources',
    title: '流量来源分布',
    titleStyle: {
        color: sciFiColors.text
    },
    height: '300px',
    color: [sciFiColors.primary, '#00ccff', '#0099ff', '#0066cc'],
    backgroundColor: sciFiColors.cardBg,
    textStyle: { color: sciFiColors.text },
    legend: {
        show: true,
        textStyle: { color: sciFiColors.text },
        bottom: 10
    },
    tooltip: {
        show: true,
        backgroundColor: sciFiColors.cardBg,
        borderColor: sciFiColors.primary,
        textStyle: { color: sciFiColors.text }
    },
    series: [{
        type: 'pie',
        radius: '70%',
        center: ['50%', '50%'],
        data: [
            { name: '直接访问', value: 35 },
            { name: '搜索引擎', value: 28 },
            { name: '社交媒体', value: 20 },
            { name: '外部引荐', value: 17 }
        ],
        itemStyle: {
            borderColor: sciFiColors.background,
            borderWidth: 1
        },
        label: {
            show: false // 关闭标签显示
        }
    }]
});

// 性能指标雷达图配置
export const performanceConfig = ref<RadarChartConfig>({
    id: 'performance-metrics',
    title: '系统性能指标',
    height: '300px',
    titleStyle: { color: sciFiColors.text },
    color: [sciFiColors.primary, sciFiColors.accent], // 两个颜色分别对应 Current 和 Average
    backgroundColor: sciFiColors.cardBg,
    textStyle: { color: sciFiColors.text },
    legend: {
        show: true,
        textStyle: { color: sciFiColors.text }
    },
    tooltip: {
        show: true,
        backgroundColor: sciFiColors.cardBg,
        borderColor: sciFiColors.primary,
        textStyle: { color: sciFiColors.text }
    },
    radar: {
        shape: 'polygon',
        splitArea: {
            areaStyle: {
                color: ['rgba(0, 180, 255, 0.1)', 'rgba(0, 180, 255, 0.05)']
            }
        },
        axisName: {
            color: sciFiColors.text
        },
        axisLine: { lineStyle: { color: sciFiColors.grid } },
        splitLine: { lineStyle: { color: sciFiColors.grid } },
        indicator: [
            { name: '在线率', max: 100 },
            { name: '响应速度', max: 100 },
            { name: '可靠性', max: 100 },
            { name: '安全性', max: 100 },
            { name: '扩展性', max: 100 }
        ]
    },
    series: [
        // 当前数据
        {
            name: '当前值',
            type: 'radar',
            data: [{ value: [98, 85, 92, 95, 88] }],
            areaStyle: {
                color: 'rgba(0, 180, 255, 0.3)' // 半透明填充色
            }
        },
        // 平均值数据
        {
            name: '平均值',
            type: 'radar',
            data: [{ value: [90, 75, 85, 80, 82] }],
            areaStyle: {
                color: 'rgba(255, 100, 100, 0.3)' // 半透明填充色
            },
            lineStyle: {
                width: 1,
                type: 'dashed' // 用虚线表示平均值
            }
        }
    ]
});

// 页面访问柱状图配置
export const pageViewsConfig = ref<BarChartConfig>({
    id: 'page-views',
    title: '页面访问量TOP',
    titleStyle: {
        color: sciFiColors.text
    },
    height: '300px',
    color: [sciFiColors.primary],
    backgroundColor: sciFiColors.cardBg,
    textStyle: { color: sciFiColors.text },
    xAxis: {
        type: 'category',
        data: ['首页', '博客', '定价', '文档', '关于', '联系'],
        axisLine: { lineStyle: { color: sciFiColors.grid } },
        axisLabel: {
            color: sciFiColors.text,
            rotate: 45
        }
    },
    yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: sciFiColors.text } },
        axisLabel: { color: sciFiColors.text },
        splitLine: { lineStyle: { color: sciFiColors.grid } }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
    },
    tooltip: {
        trigger: 'item',
        backgroundColor: sciFiColors.cardBg,
        borderColor: sciFiColors.primary,
        textStyle: { color: sciFiColors.text }
    },
    series: [{
        type: 'bar',
        data: [4500, 3200, 2800, 2100, 1800, 1500],
        name: '访问量',
        barWidth: '40%',
        itemStyle: {
            color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: sciFiColors.primary },
                    { offset: 1, color: sciFiColors.secondary }
                ]
            }
        }
    }]
});

// 用户行为散点图配置
export const userBehaviorConfig = ref<ScatterChartConfig>({
    id: 'user-behavior',
    title: '用户行为模式',
    titleStyle: {
        color: sciFiColors.text
    },
    height: '300px',
    color: [sciFiColors.primary, sciFiColors.accent],
    backgroundColor: sciFiColors.cardBg,
    textStyle: { color: sciFiColors.text },
    xAxis: {
        type: 'value',
        name: '页面停留时间(分钟)',
        axisLine: { lineStyle: { color: sciFiColors.grid } },
        axisLabel: { color: sciFiColors.text }
    },
    yAxis: {
        type: 'value',
        name: '交互次数',
        axisLine: { lineStyle: { color: sciFiColors.text } },
        axisLabel: { color: sciFiColors.text }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    series: [{
        type: 'scatter',
        name: '交互数据',
        data: [
            [2.5, 8], [5.2, 12], [7.8, 18], [3.1, 6], [6.4, 15],
            [4.7, 10], [8.3, 20], [1.9, 4], [9.1, 22], [5.8, 14]
        ],
        symbolSize: 12
    }],
    tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
            return `
        <div style="font-weight: bold;">用户行为</div>
        <div>停留时间: <b>${params.value[0]}</b> 分钟</div>
        <div>交互次数: <b>${params.value[1]}</b> 次</div>
      `;
        },
        backgroundColor: sciFiColors.cardBg,
        borderColor: sciFiColors.primary,
        textStyle: { color: sciFiColors.text }
    },
    emphasis: {
        label: {
            show: false,
        }
    }
});

// 系统健康度仪表盘配置
export const systemHealthConfig = ref<GaugeChartConfig>({
    id: 'system-health',
    title: '系统健康状态',
    titleStyle: {
        color: sciFiColors.text
    },
    subtitleStyle: {
        color: sciFiColors.text
    },
    subtitle: '实时监控',
    width: '100%',
    height: '300px',
    tooltip: {
        show: true,
        formatter: function(params: any) {
            return `
        <div style="font-weight: bold; margin-bottom: 5px;">系统健康度: ${params.value}%</div>
        <div>优秀: 80-100%</div>
        <div>警告: 60-79%</div>
        <div>危险: 0-59%</div>
      `;
        },
        backgroundColor: sciFiColors.cardBg,
        borderColor: sciFiColors.primary,
        textStyle: { color: sciFiColors.text },
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        boxShadow: '0 2px 10px rgba(0, 255, 255, 0.2)'
    },
    series: [
        {
            type: 'gauge',
            name: '健康度',
            value: 87,
            min: 0,
            max: 100,
            splitNumber: 10,
            radius: '80%',
            center: ['50%', '65%'],
            startAngle: 220,
            endAngle: -40,
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 0,
                    colorStops: [
                        { offset: 0, color: '#00ffcc' },
                        { offset: 0.7, color: '#00ffcc' },
                        { offset: 1, color: '#0099ff' }
                    ]
                }
            },
            progress: {
                show: true,
                width: 25,
                roundCap: false
            },
            pointer: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    width: 25,
                    color: [[1, 'rgba(50, 70, 90, 0.3)']]
                }
            },
            axisTick: {
                distance: -40,
                splitNumber: 5,
                lineStyle: {
                    width: 2,
                    color: sciFiColors.text
                }
            },
            splitLine: {
                distance: -48,
                length: 12,
                lineStyle: {
                    width: 3,
                    color: sciFiColors.text
                }
            },
            axisLabel: {
                show: false,
            },
            anchor: {
                show: false
            },
            title: {
                show: false
            },
            detail: {
                valueAnimation: true,
                width: '60%',
                lineHeight: 36,
                borderRadius: 8,
                offsetCenter: ['0', '-5%'],
                fontSize: 32,
                fontWeight: 'bolder',
                formatter: '{value}%',
                color: sciFiColors.primary,
                padding: [8, 0]
            }
        }
    ]
});

// 大数据量面积图配置
export const bigDataAreaConfig = ref<LineChartConfig>({
    id: 'big-data-area',
    title: '实时数据流监控',
    titleStyle: {
        color: sciFiColors.text
    },
    subtitleStyle: {
        color: sciFiColors.text
    },
    subtitle: '最近200个数据点',
    height: '400px',
    color: [sciFiColors.primary, sciFiColors.accent],
    backgroundColor: sciFiColors.cardBg,
    textStyle: { color: sciFiColors.text },
    legend: {
        show: false,
        textStyle: { color: sciFiColors.text },
        top: 10,
        right: '5%'
    },
    tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: sciFiColors.cardBg,
        borderColor: sciFiColors.primary,
        textStyle: { color: sciFiColors.text },
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: sciFiColors.primary,
                width: 1
            }
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: { lineStyle: { color: sciFiColors.grid } },
        axisLabel: {
            color: sciFiColors.text,
            showMinLabel: true,
            showMaxLabel: true
        },
        data: Array.from({length: 200}, (_, i) => `P${i}`)
    },
    yAxis: {
        type: 'value',
        name: '数值',
        axisLine: { lineStyle: { color: sciFiColors.text } },
        axisLabel: { color: sciFiColors.text },
        splitLine: { lineStyle: { color: sciFiColors.grid } }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    series: [
        {
            name: '数据流A',
            type: 'line',
            showSymbol: false,
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(0, 180, 255, 0.5)' },
                        { offset: 1, color: 'rgba(0, 180, 255, 0.1)' }
                    ]
                }
            },
            lineStyle: {
                width: 1
            },
            data: Array.from({length: 200}, () => Math.floor(Math.random() * 500) + 300)
        },
        {
            name: '数据流B',
            type: 'line',
            showSymbol: false,
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(0, 255, 204, 0.5)' },
                        { offset: 1, color: 'rgba(0, 255, 204, 0.1)' }
                    ]
                }
            },
            lineStyle: {
                width: 1
            },
            data: Array.from({length: 200}, () => Math.floor(Math.random() * 300) + 100)
        }
    ],
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 20
        },
        {
            start: 0,
            end: 20,
            backgroundColor: sciFiColors.cardBg,
            borderColor: sciFiColors.primary,
            textStyle: { color: sciFiColors.text }
        }
    ]
});
