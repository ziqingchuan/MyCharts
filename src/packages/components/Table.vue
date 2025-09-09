<template>
  <div class="table-container">
    <table class="base-table" :class="{ 'has-border': config.border, 'has-stripe': config.stripe }" config="">
      <thead>
      <tr>
        <!-- 复选框列 -->
        <th v-if="config.selection" class="selection-column">
          <input
              type="checkbox"
              v-model="selectAll"
              @change="handleSelectAll"
              :disabled="!currentPageData || currentPageData.length === 0"
          >
        </th>
        <!-- 表头列 -->
        <th
            v-for="column in config.columns"
            :key="column.prop"
            :style="{ width: column.width ? `${column.width}px` : 'auto', textAlign: column.align || 'left' }"
        >
          {{ column.label }}
        </th>
      </tr>
      </thead>
      <tbody>
      <!-- 渲染“当前页数据”，替换原来的config.data -->
      <tr
          v-for="(row, index) in currentPageData"
          :key="getRowKey(row, index)"
      :class="{ 'stripe-row': config.stripe && index % 2 === 1 }"
      >
      <!-- 复选框 -->
      <td v-if="config.selection" class="selection-column">
        <input
            type="checkbox"
            v-model="selectedRows"
            :value="row"
            @change="handleSelectionChange"
        >
      </td>
      <!-- 数据列 -->
      <td
          v-for="column in config.columns"
          :key="column.prop"
          :style="{ textAlign: column.align || 'left' }"
      >
        <template v-if="column.formatter">
          <span v-html="column.formatter(row, index)"></span>
        </template>
        <template v-else>
          {{ row[column.prop] }}
        </template>
      </td>
      </tr>
      <!-- 空数据提示 -->
      <tr v-if="!currentPageData || currentPageData.length === 0">
        <td :colspan="(config.selection ? 1 : 0) + config.columns.length" class="empty-row">
          暂无数据
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 分页组件 -->
    <div class="pagination" v-if="showPagination">
      <button
          @click="changePage(1)"
          :disabled="currentPage === 1"
      >
        首页
      </button>
      <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
      >
        上一页
      </button>
      <span>
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
      </span>
      <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
      >
        下一页
      </button>
      <button
          @click="changePage(totalPages)"
          :disabled="currentPage === totalPages"
      >
        末页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs } from 'vue';
import type { TableConfig } from '@/types';

const props = defineProps<{
  config: TableConfig;
}>();

// 解构props，方便使用
const { config } = toRefs(props);

// 1. 分页核心状态
const currentPage = ref(config.value.pagination?.currentPage || 1); // 当前页码
const pageSize = ref(config.value.pagination?.pageSize || 10);      // 每页条数

// 2. 计算“当前页需要显示的数据”（核心逻辑）
const currentPageData = computed(() => {
  if (!config.value.data || config.value.data.length === 0) return [];

  // 计算切片的起始和结束索引
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;

  // 对原始数据进行切片，返回当前页数据
  return config.value.data.slice(startIndex, endIndex);
});

// 3. 计算总页数
const totalPages = computed(() => {
  if (!config.value.data || config.value.data.length === 0) return 1;
  return Math.ceil(config.value.data.length / pageSize.value);
});

// 4. 控制分页是否显示（当数据总量 <= 页大小，或未配置分页时不显示）
const showPagination = computed(() => {
  if (config.value.pagination === false) return false;
  return config.value.data.length > pageSize.value;
});

// 5. 选择相关状态
const selectedRows = ref<any[]>([]);
const selectAll = ref(false);

// 6. 优化row的key（避免使用index导致的复用问题，优先用row的id）
const getRowKey = (row: any, index: number) => {
  return row.id || index;
};

// 7. 分页变更逻辑
const changePage = (page: number) => {
  // 边界校验
  if (page < 1 || page > totalPages.value) return;

  // 更新当前页码
  currentPage.value = page;

  // 清空当前页的选择状态（可选，根据需求决定是否保留）
  selectedRows.value = [];
  selectAll.value = false;

  // 触发分页事件，通知父组件页码变更
  emit('page-change', currentPage.value, pageSize.value);
};

// 8. 全选逻辑（只针对当前页数据）
const handleSelectAll = () => {
  if (selectAll.value) {
    // 全选：将当前页数据加入选中
    selectedRows.value = [...currentPageData.value];
  } else {
    // 取消全选：清空选中
    selectedRows.value = [];
  }
  emit('selection-change', [...selectedRows.value]);
};

// 9. 单选逻辑
const handleSelectionChange = () => {
  // 当当前页所有数据都被选中时，勾选全选框
  selectAll.value = currentPageData.value.length > 0 && selectedRows.value.length === currentPageData.value.length;
  emit('selection-change', [...selectedRows.value]);
};

// 10. 监听props中分页配置的变化（如父组件修改了currentPage）
watch(
    () => config.value.pagination?.currentPage,
    (newVal) => {
      if (newVal) currentPage.value = newVal;
    },
    { immediate: true }
);

// 11. 监听props中数据的变化（如父组件更新了data）
watch(
    () => config.value.data,
    () => {
      // 数据变化时，重置选择状态和页码（可选，根据需求调整）
      selectedRows.value = [];
      selectAll.value = false;
      currentPage.value = 1;
    },
    { deep: true }
);

// 12. 监听页大小变化（如果父组件修改了pageSize）
watch(
    () => config.value.pagination?.pageSize,
    (newVal) => {
      if (newVal) {
        pageSize.value = newVal;
        // 页大小变化时，重置到第一页
        currentPage.value = 1;
      }
    },
    { immediate: true }
);

// 13. 暴露事件
const emit = defineEmits<{
  (e: 'selection-change', rows: any[]): void;
  (e: 'page-change', currentPage: number, pageSize: number): void;
}>();
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow: auto;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.base-table th,
.base-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.base-table th {
  background-color: #f9fafb;
  font-weight: 500;
  color: #374151;
}

.has-border th,
.has-border td {
  border: 1px solid #e5e7eb;
}

.has-stripe .stripe-row {
  background-color: #f9fafb;
}

.selection-column {
  width: 40px;
  text-align: center;
}

.empty-row {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
}

.pagination {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.pagination button {
  padding: 4px 12px;
  border: 1px solid #e5e7eb;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
