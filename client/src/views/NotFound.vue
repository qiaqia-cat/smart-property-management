<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-icon">404</div>
      <h1>页面未找到</h1>
      <p>您访问的页面不存在或已被删除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/login')
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.not-found-content {
  text-align: center;
}

.not-found-icon {
  font-size: 120px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 20px;
}

.not-found-content h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.not-found-content p {
  color: #999;
  margin-bottom: 30px;
}
</style>
