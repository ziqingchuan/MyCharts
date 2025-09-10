import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/MyCharts/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@packages': path.resolve(__dirname, './src/packages'),
      '@types': path.resolve(__dirname, './src/packages/types')
    }
  },
  build: {
    // 分割代码
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型库单独打包
          echarts: ['echarts'],
          uuid: ['uuid'],
        }
      }
    },
    // 调整警告阈值（可选）
    chunkSizeWarningLimit: 1000 // 1000KB
  },
});
