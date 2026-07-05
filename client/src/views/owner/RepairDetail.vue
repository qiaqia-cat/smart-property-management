<template>
  <div class="page-container">
    <div class="page-header">
      <h2>工单详情</h2>
      <el-button @click="goBack">返回</el-button>
    </div>
    <el-card v-if="order" class="detail-card">
      <div class="detail-row">
        <span class="label">工单编号</span>
        <span class="value">{{ order.id }}</span>
      </div>
      <div class="detail-row">
        <span class="label">报修类型</span>
        <span class="value">{{ order.type }}</span>
      </div>
      <div class="detail-row">
        <span class="label">工单标题</span>
        <span class="value">{{ order.title }}</span>
      </div>
      <div class="detail-row">
        <span class="label">详细描述</span>
        <span class="value">{{ order.description }}</span>
      </div>
      <div class="detail-row">
        <span class="label">地址</span>
        <span class="value">{{ order.location }}</span>
      </div>
      <div class="detail-row">
        <span class="label">状态</span>
        <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
      </div>
      <div class="detail-row" v-if="order.worker">
        <span class="label">维修工人</span>
        <span class="value">{{ order.worker.name }}（{{ order.worker.skill }}）</span>
      </div>
      <div class="detail-row" v-if="order.repair_result">
        <span class="label">维修结果</span>
        <span class="value">{{ order.repair_result }}</span>
      </div>
      <div class="detail-row" v-if="order.repair_img">
        <span class="label">维修图片</span>
        <div class="value">
          <img :src="order.repair_img" alt="维修图片" class="repair-img" @click="previewImage(order.repair_img)" />
        </div>
      </div>
      <div class="detail-row" v-if="order.rating">
        <span class="label">评分</span>
        <el-rate :model-value="toDisplayRating(order.rating)" :max="5" disabled />
      </div>
      <div class="detail-row" v-if="order.feedback">
        <span class="label">评价内容</span>
        <span class="value">{{ order.feedback }}</span>
      </div>
      <div class="detail-row">
        <span class="label">提交时间</span>
        <span class="value">{{ formatTime(order.create_time) }}</span>
      </div>
      <div class="detail-row" v-if="order.finish_time">
        <span class="label">完成时间</span>
        <span class="value">{{ formatTime(order.finish_time) }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '@/utils/request'

const router = useRouter()
const route = useRoute()
const order = ref(null)

const fetchOrderDetail = async () => {
  const res = await axios.get(`/repair-orders/${route.params.id}`)
  order.value = res.data
}

const goBack = () => {
  router.push('/owner/repair')
}

const getStatusText = (status) => {
  const map = { 0: '待分派', 1: '待接单', 2: '处理中', 3: '已完成' }
  return map[status] || '未知'
}

const getStatusType = (status) => {
  const map = { 0: 'warning', 1: 'info', 2: 'primary', 3: 'success' }
  return map[status] || 'default'
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

// 兼容旧数据：旧数据按 10 分制存储，新数据按 5 分制
const toDisplayRating = (r) => {
  if (!r) return 0
  return r > 5 ? Math.round(r / 2 * 10) / 10 : r
}

const previewImage = (url) => {
  window.open(url, '_blank')
}

onMounted(() => {
  fetchOrderDetail()
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
  font-size: 24px;
  color: #333;
  margin: 0;
}

.detail-card {
  max-width: 600px;
}

.detail-row {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  width: 100px;
  font-weight: bold;
  color: #666;
}

.detail-row .value {
  flex: 1;
  color: #333;
  word-break: break-all;
}

.repair-img {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.repair-img:hover {
  transform: scale(1.02);
}
</style>
