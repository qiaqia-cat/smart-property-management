<template>
  <div class="page-container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <img src="/worker-avatar.jpg" alt="默认头像" />
        </div>
        <div class="profile-info">
          <h2>{{ userInfo.name }}</h2>
          <el-tag type="primary">维修工人</el-tag>
        </div>
      </div>
      <el-descriptions :column="2" border class="profile-detail">
        <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="技能特长">{{ userInfo.skill }}</el-descriptions-item>
        <el-descriptions-item label="完工数量">{{ userInfo.completed_orders }}</el-descriptions-item>
        <el-descriptions-item label="平均评分">{{ (userInfo.avg_rating > 5 ? (userInfo.avg_rating / 2).toFixed(1) : (userInfo.avg_rating || 0)) }}分</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ formatDate(userInfo.create_time) }}</el-descriptions-item>
      </el-descriptions>
      <div class="profile-actions">
        <el-button @click="showChangePwdDialog = true">修改密码</el-button>
      </div>
    </div>

    <el-dialog title="修改密码" v-model="showChangePwdDialog" width="400px">
      <el-form :model="pwdForm" label-width="80px">
        <el-form-item label="原密码" required>
          <el-input v-model="pwdForm.oldPassword" type="password" placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" required>
          <el-input v-model="pwdForm.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" required>
          <el-input v-model="pwdForm.confirmPassword" type="password" placeholder="请确认新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showChangePwdDialog = false">取消</el-button>
        <el-button type="primary" :loading="changingPwd" @click="changePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import axios from '@/utils/request'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userInfo = ref(userStore.userInfo || {})
const showChangePwdDialog = ref(false)
const changingPwd = ref(false)
const pwdForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

const changePassword = async () => {
  if (!pwdForm.value.oldPassword || !pwdForm.value.newPassword) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  changingPwd.value = true
  try {
    const res = await axios.put('/auth/change-password', pwdForm.value)
    if (res.code === 200) {
      ElMessage.success('密码修改成功')
      showChangePwdDialog.value = false
      pwdForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    }
  } catch (e) {
    ElMessage.error('密码修改失败')
  } finally {
    changingPwd.value = false
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.profile-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f2f5;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.profile-info h2 {
  margin: 0 0 8px 0;
}

.profile-detail {
  margin-bottom: 24px;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
}
</style>