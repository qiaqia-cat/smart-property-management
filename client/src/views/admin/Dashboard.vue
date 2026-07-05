<template>
  <div class="page-container">
    <div class="page-header">
      <h2>数据概览</h2>
    </div>
    <div class="stats-grid">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon user-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-info">
          <h3>{{ overview?.userCount || 0 }}</h3>
          <p>业主总数</p>
        </div>
      </el-card>
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon order-icon">
          <el-icon><Tools /></el-icon>
        </div>
        <div class="stat-info">
          <h3>{{ overview?.pendingOrders || 0 }}</h3>
          <p>待处理工单</p>
        </div>
      </el-card>
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon complaint-icon">
          <el-icon><Message /></el-icon>
        </div>
        <div class="stat-info">
          <h3>{{ overview?.pendingComplaints || 0 }}</h3>
          <p>待处理投诉</p>
        </div>
      </el-card>
      <el-card class="stat-card" shadow="hover">
        <div class="stat-icon fee-icon">
          <el-icon><Wallet /></el-icon>
        </div>
        <div class="stat-info">
          <h3>{{ overview?.pendingFees || 0 }}</h3>
          <p>待缴费用</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/request'
import { User, Tools, Message, Wallet } from '@element-plus/icons-vue'

const overview = ref(null)

const fetchOverview = async () => {
  const res = await axios.get('/dashboard/overview')
  overview.value = res.data
}

onMounted(() => {
  fetchOverview()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
  white-space: nowrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 20px;
  text-align: center;
  border-radius: 16px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  margin-bottom: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.order-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.complaint-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.fee-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info h3 {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.stat-info p {
  font-size: 15px;
  color: #888;
  margin: 0;
  letter-spacing: 0.5px;
}
</style>
