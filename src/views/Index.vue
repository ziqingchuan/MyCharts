<template>
  <div class="sci-fi-dashboard">
    <!-- 头部标题区 -->
    <div class="dashboard-header">
      <h1 class="glow-text">官网数据监控系统</h1>
      <p class="subtitle">实时监控与数据可视化</p>
      <div class="status-bar">
        <span class="status-indicator online"></span>
        <span>系统状态：在线</span>
        <span class="time-display">{{ currentTime }}</span>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-value">24.8K</div>
          <div class="stat-label">总访问量</div>
        </div>
        <div class="stat-trend up">+12.5%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💬</div>
        <div class="stat-content">
          <div class="stat-value">3.2K</div>
          <div class="stat-label">活跃会话</div>
        </div>
        <div class="stat-trend up">+8.3%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🔄</div>
        <div class="stat-content">
          <div class="stat-value">2.1S</div>
          <div class="stat-label">平均响应</div>
        </div>
        <div class="stat-trend down">-15.2%</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-value">¥8.7K</div>
          <div class="stat-label">营收</div>
        </div>
        <div class="stat-trend up">+23.1%</div>
      </div>
    </div>

    <!-- 主要图表区域 -->
    <div class="charts-grid">
      <!-- 实时数据监控图 -->
      <div class="chart-container full-width">
        <LineChart :config="bigDataAreaConfig" />
      </div>

      <!-- 流量趋势图 -->
      <div class="chart-container">
        <LineChart :config="trafficConfig" />
      </div>

      <!-- 用户分布饼图 -->
      <div class="chart-container">
        <PieChart :config="userSourceConfig" />
      </div>

      <!-- 页面访问柱状图 -->
      <div class="chart-container">
        <BarChart :config="pageViewsConfig" />
      </div>

      <!-- 用户行为散点图 -->
      <div class="chart-container">
        <ScatterChart :config="userBehaviorConfig" />
      </div>

      <!-- 系统健康度仪表盘 -->
      <div class="chart-container">
        <GaugeChart :config="systemHealthConfig" />
      </div>

      <!-- 性能指标雷达图 -->
      <div class="chart-container">
        <RadarChart :config="performanceConfig" />
      </div>
    </div>

    <!-- 实时数据流 -->
    <div class="realtime-feed">
      <h3 class="section-title">实时活动流</h3>
      <div class="activity-list">
        <div v-for="(activity, index) in activities" :key="index" class="activity-item">
          <span class="activity-time">{{ activity.time }}</span>
          <span class="activity-content">{{ activity.content }}</span>
          <span class="activity-type" :class="activity.type">{{ activity.type }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { LineChart, PieChart, BarChart, RadarChart, ScatterChart, GaugeChart } from "@packages";
import {
  bigDataAreaConfig,
  trafficConfig,
  pageViewsConfig,
  userSourceConfig,
  userBehaviorConfig,
  systemHealthConfig,
  performanceConfig
} from "../consts/mockData.js"

// 当前时间显示
const currentTime = ref('');
const activities = ref([
  { time: '14:23:45', content: '用户 "neo" 从纽约登录', type: 'login' },
  { time: '14:23:42', content: '页面 "/dashboard" 加载耗时1.2秒', type: 'performance' },
  { time: '14:23:38', content: '新订阅：高级套餐', type: 'revenue' },
  { time: '14:23:35', content: 'API调用：/analytics 接口', type: 'api' },
  { time: '14:23:30', content: '用户 "trinity" 完成结算', type: 'conversion' }
]);

// 更新时间
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
// 生命周期
onMounted(() => {
  updateTime();
  const timer = setInterval(updateTime, 1000);

  // 模拟实时数据更新
  const dataTimer = setInterval(() => {
    activities.value.unshift({
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      content: `检测到用户活动来自 ${Math.random() > 0.5 ? '电脑端' : '移动端'}`,
      type: Math.random() > 0.5 ? 'login' : 'api'
    });

    if (activities.value.length > 10) {
      activities.value.pop();
    }
  }, 3000);

  onUnmounted(() => {
    clearInterval(timer);
    clearInterval(dataTimer);
  });
});
</script>

<style scoped>
@import '../styles/index.css';
</style>
