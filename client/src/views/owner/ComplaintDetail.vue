<template>
  <div class="page-container">
    <div class="page-header">
      <h2>投诉详情</h2>
      <el-button @click="goBack">返回</el-button>
    </div>
    <el-card v-if="complaint" class="detail-card">
      <div class="detail-row">
        <span class="label">编号</span>
        <span class="value">{{ complaint.id }}</span>
      </div>
      <div class="detail-row">
        <span class="label">类型</span>
        <el-tag type="primary">{{ complaint.type }}</el-tag>
      </div>
      <div class="detail-row">
        <span class="label">标题</span>
        <span class="value">{{ complaint.title }}</span>
      </div>
      <div class="detail-row">
        <span class="label">内容</span>
        <span class="value">{{ complaint.content }}</span>
      </div>
      <div class="detail-row">
        <span class="label">状态</span>
        <el-tag :type="complaint.status === 0 ? 'warning' : 'success'">
          {{ complaint.status === 0 ? '待处理' : '已处理' }}
        </el-tag>
      </div>
      <div class="detail-row" v-if="complaint.handle_result">
        <span class="label">处理结果</span>
        <span class="value">{{ complaint.handle_result }}</span>
      </div>
      <div class="detail-row" v-if="complaint.handler">
        <span class="label">处理人</span>
        <span class="value">{{ complaint.handler.name }}</span>
      </div>
      <div class="detail-row">
        <span class="label">提交时间</span>
        <span class="value">{{ formatTime(complaint.create_time) }}</span>
      </div>
      <div class="detail-row" v-if="complaint.handle_time">
        <span class="label">处理时间</span>
        <span class="value">{{ formatTime(complaint.handle_time) }}</span>
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
const complaint = ref(null)

const fetchComplaintDetail = async () => {
  const res = await axios.get(`/complaints/${route.params.id}`)
  complaint.value = res.data
}

const goBack = () => {
  router.push('/owner/complaint')
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchComplaintDetail()
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
</style>
