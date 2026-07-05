<template>
  <div class="layout-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>物业管理系统</h2>
      </div>
      <nav class="sidebar-menu">
        <el-menu :default-active="activeMenu" class="sidebar-menu-list">
          <el-menu-item index="/admin/dashboard" @click="navigate('/admin/dashboard')">
            <el-icon><DataBoard /></el-icon>
            <span>数据概览</span>
          </el-menu-item>
          <el-menu-item index="/admin/users" @click="navigate('/admin/users')">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/repair-orders" @click="navigate('/admin/repair-orders')">
            <el-icon><Tools /></el-icon>
            <span>工单管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/complaints" @click="navigate('/admin/complaints')">
            <el-icon><Message /></el-icon>
            <span>投诉管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/announcements" @click="navigate('/admin/announcements')">
            <el-icon><Bell /></el-icon>
            <span>公告管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/ranking" @click="navigate('/admin/ranking')">
            <el-icon><Trophy /></el-icon>
            <span>工人排名</span>
          </el-menu-item>
          <el-menu-item index="/admin/parking" @click="navigate('/admin/parking')">
            <el-icon><Van /></el-icon>
            <span>停车管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/fees" @click="navigate('/admin/fees')">
            <el-icon><Wallet /></el-icon>
            <span>费用管理</span>
          </el-menu-item>
        </el-menu>
      </nav>
    </aside>
    <main class="main-content">
      <header class="top-header">
        <div class="header-left">
          <span class="role-label">管理员</span>
        </div>
        <div class="header-right">
          <span>{{ userStore.userInfo?.name }}</span>
          <el-button link @click="handleLogout">退出登录</el-button>
        </div>
      </header>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { DataBoard, User, Tools, Message, Bell, Trophy, Van, Wallet } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const navigate = (path) => {
  router.push(path)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 200px;
  background: #2c3e50;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  background: #34495e;
  text-align: center;
}

.sidebar-header h2 {
  font-size: 18px;
  margin: 0;
}

.sidebar-menu {
  flex: 1;
  padding-top: 20px;
}

.sidebar-menu-list {
  border-right: none;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.header-left {
  display: flex;
  align-items: center;
}

.role-label {
  background: #e74c3c;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
