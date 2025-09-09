// 基础配置类型
export interface BaseComponentConfig {
    id?: string;
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: Record<string, any>;
}

// 图表基础配置
export interface BaseChartConfig extends BaseComponentConfig {
    title?: string;
    titleStyle?: {
        color?: string;
        fontSize?: number;
        fontWeight?: string;
    };
    subtitleStyle?: {
        color?: string;
        fontSize?: number;
        fontWeight?: string;
    };
    subtitle?: string;
    legend?: boolean | {
        position?: 'top' | 'bottom' | 'left' | 'right';
        [key: string]: any;
    };
    tooltip?: boolean | {
        trigger?: 'item' | 'axis';
        [key: string]: any;
    };
    grid?: {
        top?: string | number;
        right?: string | number;
        bottom?: string | number;
        left?: string | number;
    };
}


/**
 * ======================================== 折线图相关配置类型 ========================================
 */
// 折线图数据点样式配置
export interface LineItemStyle {
    color?: string;
    width?: number;
    type?: 'solid' | 'dashed' | 'dotted';
    [key: string]: any;
}

// 折线图标记点配置
export interface LineMarkPoint {
    show?: boolean;
    symbol?: string;
    symbolSize?: number;
    data?: Array<{
        type?: 'max' | 'min' | 'average';
        name?: string;
    }>;
    [key: string]: any;
}

// 折线图标记线配置
export interface LineMarkLine {
    show?: boolean;
    symbol?: string[];
    data?: Array<{
        type?: 'max' | 'min' | 'average';
        name?: string;
    }>;
    [key: string]: any;
}

// 折线图区域填充配置
export interface LineAreaStyle {
    color?: string | string[];
    opacity?: number;
    [key: string]: any;
}

// 折线图系列配置
export interface LineSeries {
    name?: string;
    type: 'line';
    data: number[] | Array<{
        value: number;
        itemStyle?: LineItemStyle;
        [key: string]: any;
    }>;
    smooth?: boolean;
    step?: boolean | 'start' | 'middle' | 'end';
    symbol?: string;
    symbolSize?: number;
    showSymbol?: boolean;
    lineStyle?: LineItemStyle;
    itemStyle?: LineItemStyle;
    areaStyle?: LineAreaStyle;
    markPoint?: LineMarkPoint;
    markLine?: LineMarkLine;
    stack?: string;
    [key: string]: any;
}

// 坐标轴配置
export interface AxisConfig {
    type?: 'category' | 'value' | 'time' | 'log';
    name?: string;
    nameLocation?: 'start' | 'middle' | 'end';
    nameTextStyle?: Record<string, any>;
    data?: string[] | number[];
    boundaryGap?: boolean | [number, number];
    min?: number | 'dataMin';
    max?: number | 'dataMax';
    axisLabel?: {
        show?: boolean;
        rotate?: number;
        formatter?: string | ((value: any) => string);
        [key: string]: any;
    };
    axisLine?: {
        show?: boolean;
        [key: string]: any;
    };
    axisTick?: {
        show?: boolean;
        [key: string]: any;
    };
    splitLine?: {
        show?: boolean;
        [key: string]: any;
    };
    [key: string]: any;
}

// 折线图配置
export interface LineChartConfig extends BaseChartConfig {
    color?: string | string[]; // 新增颜色配置，与其他图表保持一致
    xAxis?: AxisConfig; // 使用更完善的坐标轴配置
    yAxis?: AxisConfig; // 使用更完善的坐标轴配置
    series?: LineSeries[]; // 使用更详细的系列配置
    [key: string]: any;
}

/**
 * ======================================== 饼图相关配置类型 ========================================
 */
// 图例配置类型
export interface LegendConfig {
    show?: boolean;
    position?: 'top' | 'right' | 'bottom' | 'left' | [number, number];
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
    itemWidth?: number;
    itemHeight?: number;
    itemGap?: number;
    textStyle?: {
        fontSize?: number;
        color?: string;
        [key: string]: any;
    };
    data?: string[];
    selected?: Record<string, boolean>;
    [key: string]: any;
}

// 提示框配置类型
export interface TooltipConfig {
    show?: boolean;
    trigger?: 'item' | 'axis';
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    padding?: number | number[];
    textStyle?: {
        color?: string;
        fontSize?: number;
        [key: string]: any;
    };
    formatter?: string | ((params: any) => string);
    animationDelay?: number;
    axisPointer?: {
        type?: 'line' | 'shadow' | 'none' | 'cross';
        [key: string]: any;
    };
    [key: string]: any;
}

// 饼图系列配置类型
export interface PieSeriesConfig {
    type: 'pie';
    id?: string;
    name?: string;
    radius?: string | [string, string]; // 支持内外半径设置（环形图）
    center?: [string | number, string | number]; // 饼图中心位置
    data: Array<{
        name: string;
        value: number;
        itemStyle?: {
            color?: string;
            [key: string]: any;
        };
        [key: string]: any;
    }>;
    label?: {
        show?: boolean;
        position?: 'inside' | 'outside' | 'center';
        formatter?: string | ((params: any) => string);
        fontSize?: number;
        color?: string;
        [key: string]: any;
    };
    labelLine?: {
        show?: boolean;
        length?: number;
        lineStyle?: {
            width?: number;
            color?: string;
            [key: string]: any;
        };
        [key: string]: any;
    };
    emphasis?: {
        itemStyle?: {
            shadowBlur?: number;
            shadowOffsetX?: number;
            shadowColor?: string;
            [key: string]: any;
        };
        label?: {
            show?: boolean;
            fontSize?: number;
            [key: string]: any;
        };
        [key: string]: any;
    };
    selectable?: boolean;
    selectedMode?: boolean | 'single' | 'multiple';
    [key: string]: any;
}

// 完善后的饼图配置类型
export interface PieChartConfig extends BaseChartConfig {
    color?: string | string[];
    legend?: boolean | LegendConfig; // 支持布尔值快速开关或详细配置
    tooltip?: boolean | TooltipConfig; // 支持布尔值快速开关或详细配置
    series?: PieSeriesConfig[];
    [key: string]: any;
}


/**
 * ======================================== 柱状图相关配置类型 ========================================
 */
// 柱状图配置
export interface BarChartConfig extends BaseChartConfig {
    color?: string | string[]; // 新增颜色配置
    xAxis?: {
        type?: 'category' | 'value';
        data?: string[]; // X轴数据
        name?: string; // X轴名称
        axisTick?: {
            alignWithLabel?: boolean; // 刻度线是否与标签对齐
        };
        boundaryGap?: boolean; // 是否留白间隙（柱状图一般为 true）
        [key: string]: any;
    };
    yAxis?: {
        type?: 'category' | 'value';
        name?: string; // Y轴名称
        [key: string]: any;
    };
    series?: Array<{
        name?: string; // 数据系列名称
        type: 'bar'; // 固定为柱状图类型
        data: number[]; // 数据数组
        barWidth?: string | number; // 柱宽
        barGap?: string; // 柱间距离，可为百分比或数值，如 "30%" 或 "10"
        stack?: string; // 数据堆叠分组名（用于堆积柱状图）
        [key: string]: any;
    }>;
    [key: string]: any;
}

/**
 * ======================================== 雷达图相关配置类型 ========================================
 */
// 雷达图配置
export interface RadarChartConfig extends BaseChartConfig {
    color?: string | string[]; // 新增的颜色配置
    radar?: {
        shape?: 'polygon' | 'circle';
        indicator: Array<{
            name: string;
            max?: number;
            min?: number;
        }>;
        [key: string]: any;
    };
    series?: Array<{
        name?: string;
        type: 'radar';
        data: Array<{
            name?: string;
            value: number[];
        }>;
        [key: string]: any;
    }>;
    [key: string]: any;
}


/**
 * ======================================== 散点图相关配置类型 ========================================
 */
// 散点图配置
export interface ScatterChartConfig extends BaseChartConfig {
    color?: string | string[]; // 颜色配置
    xAxis?: {
        type?: 'category' | 'value';
        name?: string;
        nameLocation?: 'start' | 'middle' | 'end';
        nameTextStyle?: {
            color?: string;
            fontSize?: number;
            [key: string]: any;
        };
        data?: string[];
        min?: number | 'dataMin';
        max?: number | 'dataMax';
        splitLine?: {
            show?: boolean;
            lineStyle?: {
                color?: string;
                type?: 'solid' | 'dashed' | 'dotted';
                [key: string]: any;
            };
            [key: string]: any;
        };
        [key: string]: any;
    };
    yAxis?: {
        type?: 'category' | 'value';
        name?: string;
        nameLocation?: 'start' | 'middle' | 'end';
        nameTextStyle?: {
            color?: string;
            fontSize?: number;
            [key: string]: any;
        };
        min?: number | 'dataMin';
        max?: number | 'dataMax';
        splitLine?: {
            show?: boolean;
            lineStyle?: {
                color?: string;
                type?: 'solid' | 'dashed' | 'dotted';
                [key: string]: any;
            };
            [key: string]: any;
        };
        [key: string]: any;
    };
    legend?: boolean | {
        show?: boolean;
        position?: 'top' | 'right' | 'bottom' | 'left';
        left?: string | number;
        top?: string | number;
        textStyle?: {
            color?: string;
            fontSize?: number;
            [key: string]: any;
        };
        [key: string]: any;
    };
    tooltip?: boolean | {
        show?: boolean;
        trigger?: 'item' | 'axis';
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        formatter?: string | ((params: any) => string);
        [key: string]: any;
    };
    series?: Array<{
        name?: string; // 数据系列名称
        type: 'scatter'; // 固定为散点图类型
        data: Array<[number, number] | {
            value: [number, number];
            name?: string;
            itemStyle?: {
                color?: string;
                [key: string]: any;
            };
            [key: string]: any;
        }>; // 支持数组和对象两种形式
        symbol?: 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | string;
        symbolSize?: number | ((value: any) => number); // 点大小，支持回调函数动态计算
        itemStyle?: {
            color?: string;
            borderColor?: string;
            borderWidth?: number;
            [key: string]: any;
        };
        emphasis?: {
            itemStyle?: {
                shadowBlur?: number;
                shadowColor?: string;
                [key: string]: any;
            };
            label?: {
                show?: boolean;
                formatter?: string | ((params: any) => string);
                [key: string]: any;
            };
            [key: string]: any;
        };
        [key: string]: any;
    }>;
    [key: string]: any;
}

/**
 * ======================================== 仪表盘图相关配置类型 ========================================
 */
// 仪表盘指针样式配置
export interface GaugePointerStyle {
    color?: string;
    width?: number;
    length?: string; // 相对于半径的百分比
    [key: string]: any;
}

// 仪表盘轴线样式配置
export interface GaugeAxisLineStyle {
    color?: [number, string][] | string[]; // 支持颜色区间
    width?: number;
    [key: string]: any;
}

// 仪表盘刻度样式配置
export interface GaugeTickStyle {
    show?: boolean;
    splitNumber?: number;
    length?: number;
    lineStyle?: {
        width?: number;
        color?: string;
        [key: string]: any;
    };
    [key: string]: any;
}

// 仪表盘标签样式配置
export interface GaugeLabelStyle {
    show?: boolean;
    distance?: number;
    formatter?: string | ((value: number) => string);
    fontSize?: number;
    color?: string;
    [key: string]: any;
}

// 仪表盘标题样式配置
export interface GaugeTitleStyle {
    show?: boolean;
    offsetCenter?: [string, string];
    fontSize?: number;
    color?: string;
    [key: string]: any;
}

// 仪表盘详情样式配置
export interface GaugeDetailStyle {
    show?: boolean;
    offsetCenter?: [string, string];
    formatter?: string | ((value: number) => string);
    fontSize?: number;
    color?: string;
    [key: string]: any;
}

// 仪表盘系列配置
export interface GaugeSeries {
    name?: string;
    type: 'gauge';
    value: number; // 当前值
    min?: number; // 最小值
    max?: number; // 最大值
    radius?: string; // 半径，如 '70%'
    center?: [string, string]; // 中心位置，如 ['50%', '60%']
    startAngle?: number; // 起始角度，默认 90
    endAngle?: number; // 结束角度，默认 -270
    pointer?: {
        show?: boolean;
        type?: 'line' | 'triangle' | 'arrow';
        length?: string;
        width?: number;
        itemStyle?: GaugePointerStyle;
        [key: string]: any;
    };
    axisLine?: {
        show?: boolean;
        roundCap?: boolean;
        lineStyle?: GaugeAxisLineStyle;
        [key: string]: any;
    };
    splitLine?: GaugeTickStyle; // 分隔线
    axisTick?: GaugeTickStyle; // 刻度线
    axisLabel?: GaugeLabelStyle; // 刻度标签
    title?: GaugeTitleStyle; // 标题
    detail?: GaugeDetailStyle; // 详情
    [key: string]: any;
}

// 仪表盘图表配置
export interface GaugeChartConfig extends BaseChartConfig {
    color?: string | string[]; // 颜色配置
    tooltip?: boolean | {
        show?: boolean;
        formatter?: string | ((params: any) => string);
        [key: string]: any;
    };
    series: GaugeSeries[]; // 仪表盘系列数据
    [key: string]: any;
}
