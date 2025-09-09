
import LineChart from './components/charts/LineChart.vue';
import PieChart from './components/charts/PieChart.vue';
import BarChart from './components/charts/BarChart.vue';
import RadarChart from './components/charts/RadarChart.vue';
import ScatterChart from './components/charts/ScatterChart.vue';
import GaugeChart from './components/charts/GaugeChart.vue';

// 导出类型
export * from './types';

// 导出组件
export {
    LineChart,
    PieChart,
    BarChart,
    RadarChart,
    ScatterChart,
    GaugeChart,
};

// 批量注册组件的函数
export const install = (app: any) => {
    app.component('LineChart', LineChart);
    app.component('PieChart', PieChart);
    app.component('BarChart', BarChart);
    app.component('RadarChart', RadarChart);
    app.component('ScatterChart', ScatterChart);
    app.component('GaugeChart', GaugeChart);
};

export default {
    install,
    LineChart,
    PieChart,
    BarChart,
    RadarChart,
    ScatterChart,
    GaugeChart,
};
