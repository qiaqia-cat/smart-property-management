<template>
  <div class="login-container">
    <div class="bg-image" aria-hidden="true"></div>
    <div class="bg-overlay" aria-hidden="true"></div>
    <div class="login-wrapper">
      <div class="login-header">
        <h1>物业管理系统</h1>
        <p>请登录您的账号</p>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item class="btn-wrapper">
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <div class="login-footer">
          <span>还没有账号？</span>
          <el-button link @click="goRegister">立即注册</el-button>
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
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await userStore.login(form)
    if (res.code === 200) {
      const role = res.data.user.role
      const redirectMap = { 0: '/owner/home', 1: '/admin/dashboard', 2: '/worker/dashboard' }
      router.push(redirectMap[role])
    }
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
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

.login-wrapper {
  position: relative;
  z-index: 2;
  width: 420px;
  padding: 40px 48px;
  background: rgba(255, 248, 240, 0.88);
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.55);
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h1 {
  font-size: 30px;
  color: #5d4037;
  margin-bottom: 8px;
  letter-spacing: 3px;
  font-weight: 700;
}

.login-header p {
  color: #8d6e63;
  font-size: 14px;
  letter-spacing: 1px;
}

.login-form {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item__label) {
  color: #5d4037;
  font-weight: 500;
  font-size: 13px;
  padding-bottom: 4px;
  line-height: 1.5;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #d7ccc8 inset;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 14px;
  transition: box-shadow 0.2s;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #d35400 inset;
}

:deep(.el-input__inner) {
  height: 42px;
  color: #4e342e;
  font-size: 14px;
}

:deep(.el-input__inner::placeholder) {
  color: #bcaaa4;
}

.btn-wrapper {
  margin-top: 24px;
  margin-bottom: 8px;
}

.btn-wrapper :deep(.el-form-item__content) {
  display: flex;
  justify-content: center;
}

.login-btn {
  width: 160px;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  letter-spacing: 4px;
  background: #d35400;
  border-color: #d35400;
  box-shadow: 0 8px 20px rgba(211, 84, 0, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover {
  background: #ba4a00;
  border-color: #ba4a00;
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(211, 84, 0, 0.45);
}

.login-footer {
  text-align: center;
  margin-top: 12px;
  color: #8d6e63;
  font-size: 14px;
}

.login-footer :deep(.el-button) {
  color: #d35400;
  font-weight: 500;
}

.login-footer :deep(.el-button:hover) {
  color: #ba4a00;
}

@media (max-width: 480px) {
  .login-wrapper {
    width: 90%;
    padding: 32px 24px;
  }
}
</style>
