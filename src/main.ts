import { createApp } from 'vue';
import App from './App.vue';
import './style.css'
import ComponentLibrary from './packages'; // 导入组件库

const app = createApp(App);

// 全局注册组件库
app.use(ComponentLibrary);
app.mount('#app');
