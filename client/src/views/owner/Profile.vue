<template>
  <div class="page-container">
    <div class="page-header">
      <h2>个人中心</h2>
    </div>
    <el-card class="profile-card">
      <div class="profile-info">
        <div class="avatar-section">
          <div class="avatar">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="basic-info">
            <h3>{{ userInfo?.name }}</h3>
            <span class="role">业主</span>
          </div>
        </div>
        <div class="detail-info">
          <div class="info-row">
            <span class="label">用户名</span>
            <span class="value">{{ userInfo?.username }}</span>
          </div>
          <div class="info-row">
            <span class="label">手机号</span>
            <span class="value">{{ userInfo?.phone || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">楼栋</span>
            <span class="value">{{ userInfo?.building || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">单元</span>
            <span class="value">{{ userInfo?.unit || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">房间号</span>
            <span class="value">{{ userInfo?.room || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="label">注册时间</span>
            <span class="value">{{ formatTime(userInfo?.create_time) }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { UserFilled } from '@element-plus/icons-vue'

const userStore = useUserStore()
const userInfo = ref(null)

const fetchUserInfo = async () => {
  await userStore.getUserInfo()
  userInfo.value = userStore.userInfo
}

const formatTime = (time) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.profile-card {
  max-width: 600px;
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 40px;
}

.basic-info {
  margin-left: 20px;
}

.basic-info h3 {
  font-size: 24px;
  color: #333;
  margin: 0 0 10px 0;
}

.basic-info .role {
  background: #3498db;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.detail-info {
  padding-left: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row .label {
  width: 100px;
  font-weight: bold;
  color: #666;
}

.info-row .value {
  flex: 1;
  color: #333;
}
</style>
