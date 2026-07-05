<template>
  <div class="owner-layout">
    <header class="owner-header">
      <div class="header-brand">
        <span class="brand-icon">🏠</span>
        <span class="brand-text">物业管理系统</span>
      </div>
      <nav class="header-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="['nav-link', { active: route.path === item.path }]"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="header-actions">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notice-badge">
          <el-icon class="notice-icon" @click="navigate('/owner/messages')"><Bell /></el-icon>
        </el-badge>
        <span class="user-name">{{ userStore.userInfo?.name }}</span>
        <el-button link class="logout-btn" @click="handleLogout">退出登录</el-button>
      </div>
    </header>
    <main class="owner-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from '@/utils/request'
import { HomeFilled, Tools, Wallet, Message, User, UserFilled, Bell } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const unreadCount = ref(0)

const menuItems = [
  { path: '/owner/home', label: '首页公告', icon: HomeFilled },
  { path: '/owner/repair', label: '报修管理', icon: Tools },
  { path: '/owner/fee', label: '费用管理', icon: Wallet },
  { path: '/owner/complaint', label: '投诉建议', icon: Message },
  { path: '/owner/visitor', label: '访客管理', icon: User },
  { path: '/owner/messages', label: '我的消息', icon: Bell },
  { path: '/owner/profile', label: '个人中心', icon: UserFilled }
]

const navigate = (path) => {
  router.push(path)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const fetchUnreadCount = async () => {
  try {
    const res = await axios.get('/notifications/unread-count')
    unreadCount.value = res.data.count || 0
  } catch (e) {
    // 未登录时忽略
  }
}

onMounted(() => {
  if (userStore.token) {
    fetchUnreadCount()
  }
})

watch(() => route.path, () => {
  if (userStore.token) {
    fetchUnreadCount()
  }
})
</script>

<style scoped>
.owner-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #faf6f2;
}

.owner-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 32px;
  background: rgba(255, 248, 240, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(215, 204, 200, 0.6);
  box-shadow: 0 2px 16px rgba(93, 64, 55, 0.08);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #5d4037;
  letter-spacing: 2px;
}

.brand-icon {
  font-size: 24px;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #8d6e63;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #d35400;
  background: rgba(211, 84, 0, 0.08);
}

.nav-link.active {
  color: #fff;
  background: #d35400;
  box-shadow: 0 4px 12px rgba(211, 84, 0, 0.3);
}

.nav-link .el-icon {
  font-size: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.notice-icon {
  font-size: 22px;
  color: #8d6e63;
  cursor: pointer;
  transition: color 0.2s;
}

.notice-icon:hover {
  color: #d35400;
}

.notice-badge :deep(.el-badge__content) {
  top: 6px;
  right: 6px;
  background: #d35400;
  border: none;
}

.user-name {
  font-size: 14px;
  color: #5d4037;
  font-weight: 500;
}

.logout-btn {
  color: #8d6e63 !important;
  font-size: 14px;
}

.logout-btn:hover {
  color: #d35400 !important;
}

.owner-main {
  flex: 1;
  padding: 24px 32px 40px;
}

@media (max-width: 1100px) {
  .header-nav {
    gap: 4px;
  }

  .nav-link {
    padding: 8px 12px;
    font-size: 13px;
  }

  .nav-link span {
    display: none;
  }
}

@media (max-width: 640px) {
  .owner-header {
    padding: 0 16px;
  }

  .brand-text {
    display: none;
  }

  .owner-main {
    padding: 16px;
  }
}
</style>
