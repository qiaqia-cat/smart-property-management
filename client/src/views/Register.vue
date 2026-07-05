<template>
  <div class="register-container">
    <div class="bg-image" aria-hidden="true"></div>
    <div class="bg-overlay" aria-hidden="true"></div>
    <div class="register-wrapper">
      <div class="register-header">
        <h1>物业管理系统</h1>
        <p>创建您的账号</p>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="register-form"
      >
        <el-form-item label="角色" prop="role" class="full-row">
          <el-select v-model="form.role" placeholder="请选择角色" class="w-full">
            <el-option label="业主" :value="0" />
            <el-option label="维修工人" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>

        <template v-if="form.role === 0">
          <el-form-item label="楼栋" prop="building">
            <el-input v-model="form.building" placeholder="楼栋" />
          </el-form-item>
          <el-form-item label="单元" prop="unit">
            <el-input v-model="form.unit" placeholder="单元" />
          </el-form-item>
          <el-form-item label="房间号" prop="room" class="room-item">
            <el-input v-model="form.room" placeholder="房间号" />
          </el-form-item>
        </template>

        <el-form-item v-if="form.role === 2" label="技能" prop="skill" class="full-row">
          <el-input v-model="form.skill" placeholder="请输入技能特长" />
        </el-form-item>

        <el-form-item class="btn-wrapper full-row">
          <el-button type="primary" class="register-btn" :loading="loading" @click="handleRegister">
            注册
          </el-button>
        </el-form-item>
        <div class="register-footer full-row">
          <span>已有账号？</span>
          <el-button link @click="goLogin">立即登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  role: 0,
  username: '',
  name: '',
  phone: '',
  password: '',
  building: '',
  unit: '',
  room: '',
  skill: ''
})

const rules = {
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  building: [{ required: form.role === 0, message: '请输入楼栋', trigger: 'blur' }],
  unit: [{ required: form.role === 0, message: '请输入单元', trigger: 'blur' }],
  room: [{ required: form.role === 0, message: '请输入房间号', trigger: 'blur' }],
  skill: [{ required: form.role === 2, message: '请输入技能', trigger: 'blur' }]
}

const handleRegister = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await userStore.register(form)
    if (res.code === 200) {
      const role = res.data.user.role
      const redirectMap = { 0: '/owner/home', 2: '/worker/dashboard' }
      router.push(redirectMap[role])
    }
  } finally {
    loading.value = false
  }
}

const goLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.bg-image {
  position: absolute;
  inset: 0;
  background-image: url('/login-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(44, 62, 80, 0.55) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 1;
}

.register-wrapper {
  position: relative;
  z-index: 2;
  width: 560px;
  max-width: 92vw;
  padding: 28px 44px;
  background: rgba(255, 248, 240, 0.88);
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.55);
}

.register-header {
  text-align: center;
  margin-bottom: 18px;
}

.register-header h1 {
  font-size: 28px;
  color: #5d4037;
  margin-bottom: 6px;
  letter-spacing: 3px;
  font-weight: 700;
}

.register-header p {
  color: #8d6e63;
  font-size: 13px;
  letter-spacing: 1px;
}

.register-form {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 18px;
}

.register-form .full-row {
  grid-column: 1 / -1;
}

.register-form .room-item {
  grid-column: span 1;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

:deep(.el-form-item__label) {
  color: #5d4037;
  font-weight: 500;
  font-size: 12px;
  padding-bottom: 2px;
  line-height: 1.5;
}

:deep(.el-form-item__content) {
  width: 100%;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #d7ccc8 inset;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 12px;
  transition: box-shadow 0.2s;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #d35400 inset;
}

:deep(.el-input__inner) {
  height: 38px;
  color: #4e342e;
  font-size: 14px;
}

:deep(.el-input__inner::placeholder) {
  color: #bcaaa4;
}

:deep(.el-select .el-input__inner) {
  height: 38px;
}

.btn-wrapper {
  margin-top: 14px;
  margin-bottom: 6px;
}

.btn-wrapper :deep(.el-form-item__content) {
  display: flex;
  justify-content: center;
}

.register-btn {
  width: 160px;
  height: 42px;
  border-radius: 21px;
  font-size: 16px;
  letter-spacing: 4px;
  background: #d35400;
  border-color: #d35400;
  box-shadow: 0 8px 20px rgba(211, 84, 0, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}

.register-btn:hover {
  background: #ba4a00;
  border-color: #ba4a00;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(211, 84, 0, 0.45);
}

.register-footer {
  text-align: center;
  margin-top: 6px;
  color: #8d6e63;
  font-size: 13px;
}

.register-footer :deep(.el-button) {
  color: #d35400;
  font-weight: 500;
}

.register-footer :deep(.el-button:hover) {
  color: #ba4a00;
}

@media (max-width: 640px) {
  .register-wrapper {
    width: 92vw;
    padding: 24px 22px;
  }

  .register-form {
    grid-template-columns: 1fr;
  }

  .register-form .room-item {
    grid-column: 1 / -1;
  }
}
</style>
