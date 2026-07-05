<template>
  <div class="page-container">
    <div class="page-header">
      <h2>历史工单</h2>
    </div>
    <el-table :data="orders" border>
      <el-table-column prop="title" label="工单标题" min-width="140" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ getTypeText(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="位置" min-width="150" show-overflow-tooltip />
      <el-table-column prop="rating" label="评分" width="220">
        <template #default="{ row }">
          <div v-if="row.rating" class="rating">
            <el-rate :model-value="toDisplayRating(row.rating)" :max="5" disabled show-score text-color="#ff9900" />
          </div>
          <span v-else class="no-rating">未评价</span>
        </template>
      </el-table-column>
      <el-table-column label="业主" width="100">
        <template #default="{ row }">
          {{ row.owner?.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间" width="170">
        <template #default="{ row }">
          {{ formatDate(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="finish_time" label="完成时间" width="170">
        <template #default="{ row }">
          {{ formatDate(row.finish_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right">
        <template #default="{ row }">
          <el-button type="info" size="small" @click="viewDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-model:current-page="page"
      :page-sizes="[10, 20, 50]"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    />

    <el-dialog title="工单详情" v-model="detailDialogVisible" width="600px">
      <div v-if="selectedOrder" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单标题">{{ selectedOrder.title }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ getTypeText(selectedOrder.type) }}</el-descriptions-item>
          <el-descriptions-item label="位置">{{ selectedOrder.location }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(selectedOrder.status) }}</el-descriptions-item>
          <el-descriptions-item label="业主">{{ selectedOrder.owner?.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="评分">
            <el-rate v-if="selectedOrder.rating" :model-value="toDisplayRating(selectedOrder.rating)" :max="5" disabled show-score />
            <span v-else>未评价</span>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ formatDate(selectedOrder.create_time) }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ formatDate(selectedOrder.finish_time) }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ selectedOrder.description }}</el-descriptions-item>
          <el-descriptions-item label="维修结果" :span="2">{{ selectedOrder.repair_result }}</el-descriptions-item>
          <el-descriptions-item v-if="selectedOrder.feedback" label="业主反馈" :span="2">{{ selectedOrder.feedback }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="selectedOrder.repair_img" class="repair-img">
          <img :src="selectedOrder.repair_img" alt="维修图片" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/request'
import { ElMessage } from 'element-plus'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const orders = ref([])
const detailDialogVisible = ref(false)
const selectedOrder = ref(null)

const getTypeText = (type) => {
  const map = { 1: '水电维修', 2: '家电维修', 3: '管道疏通', 4: '门窗维修', 5: '其他' }
  return map[type] || '其他'
}

const getStatusText = (status) => {
  const map = { 1: '待接单', 2: '处理中', 3: '已完成' }
  return map[status] || '未知'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

// 兼容旧数据：旧数据按 10 分制存储(6~10)，新数据按 5 分制(1~5)
const toDisplayRating = (r) => {
  if (!r) return 0
  return r > 5 ? Math.round(r / 2 * 10) / 10 : r
}

const fetchOrders = async () => {
  try {
      const res = await axios.get('/repair-orders/worker/completed', {
        params: { page: page.value, pageSize: pageSize.value }
      })
      if (res.code === 200) {
        orders.value = res.data.orders || []
        total.value = res.data.total || 0
      }
  } catch (e) {
    ElMessage.error('获取工单列表失败')
  }
}

const viewDetail = (order) => {
  selectedOrder.value = order
  detailDialogVisible.value = true
}

const handleSizeChange = (size) => {
  page.value = 1
  fetchOrders()
}

const handleCurrentChange = (currentPage) => {
  fetchOrders()
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.detail-content {
  padding: 10px;
}

.repair-img {
  margin-top: 16px;
}

.repair-img img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
}

.rating {
  display: flex;
  align-items: center;
}

.no-rating {
  color: #909399;
}
</style>