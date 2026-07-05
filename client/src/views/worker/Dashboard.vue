<template>
  <div class="page-container">
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon pending">
            <el-icon><clock /></el-icon>
          </div>
          <div>
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">待处理</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon processing">
            <el-icon><loading /></el-icon>
          </div>
          <div>
            <div class="stat-value">{{ stats.processing }}</div>
            <div class="stat-label">处理中</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon completed">
            <el-icon><circle-check /></el-icon>
          </div>
          <div>
            <div class="stat-value">{{ stats.completed }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon total">
            <el-icon><document /></el-icon>
          </div>
          <div>
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">总工单</div>
          </div>
        </div>
      </el-card>
    </div>

    <div class="section">
      <h3>最近工单</h3>
      <el-table :data="recentOrders" border>
        <el-table-column prop="title" label="工单标题" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ getTypeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="提交时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="recentOrders.length === 0" class="empty-tip">暂无工单记录</div>
    </div>

    <el-dialog title="工单详情" v-model="detailDialogVisible" width="600px">
      <div v-if="selectedOrder" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单标题">{{ selectedOrder.title }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ getTypeText(selectedOrder.type) }}</el-descriptions-item>
          <el-descriptions-item label="位置">{{ selectedOrder.location }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(selectedOrder.status) }}</el-descriptions-item>
          <el-descriptions-item label="业主">{{ selectedOrder.owner?.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="业主电话">{{ selectedOrder.owner?.phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ formatDate(selectedOrder.create_time) }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ formatDate(selectedOrder.finish_time) || '未完成' }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ selectedOrder.description }}</el-descriptions-item>
          <el-descriptions-item v-if="selectedOrder.repair_result" label="维修结果" :span="2">{{ selectedOrder.repair_result }}</el-descriptions-item>
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
import { useRouter } from 'vue-router'
import axios from '@/utils/request'
import { ElMessage } from 'element-plus'

const router = useRouter()
const stats = ref({ pending: 0, processing: 0, completed: 0, total: 0 })
const recentOrders = ref([])
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

const getStatusType = (status) => {
  const map = { 1: 'warning', 2: 'primary', 3: 'success' }
  return map[status] || 'info'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchStats = async () => {
  try {
    const res = await axios.get('/repair-orders/worker/stats')
    if (res.code === 200) {
      const { pending, processing, completed, total, recentOrders: recent } = res.data
      stats.value = { pending: pending || 0, processing: processing || 0, completed: completed || 0, total: total || 0 }
      recentOrders.value = recent || []
    }
  } catch (e) {
    ElMessage.error('获取统计数据失败')
  }
}

const viewDetail = (orderId) => {
  const order = recentOrders.value.find(o => o.id === orderId)
  if (order) {
    selectedOrder.value = order
    detailDialogVisible.value = true
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  cursor: pointer;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.pending {
  background: #fef3c7;
  color: #f59e0b;
}

.stat-icon.processing {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-icon.completed {
  background: #dcfce7;
  color: #22c55e;
}

.stat-icon.total {
  background: #f3e8ff;
  color: #8b5cf6;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #303133;
}

.empty-tip {
  text-align: center;
  padding: 40px;
  color: #909399;
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
</style>