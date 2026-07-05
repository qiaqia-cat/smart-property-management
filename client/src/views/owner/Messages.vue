<template>
  <div class="page-container">
    <div class="page-header">
      <h2>我的消息</h2>
      <div class="header-actions">
        <el-checkbox
          v-model="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleSelectAll"
        >全选</el-checkbox>
        <el-button
          type="danger"
          size="small"
          plain
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >删除</el-button>
        <el-button v-if="unreadCount > 0" type="primary" size="small" @click="markAllRead">全部已读</el-button>
      </div>
    </div>
    <div v-if="notifications.length === 0" class="empty-tip">暂无消息</div>
    <div v-else class="message-list">
      <el-card
        v-for="item in notifications"
        :key="item.id"
        class="message-card"
        :class="{ unread: item.is_read === 0 }"
        @click="showDetail(item)"
      >
        <div class="card-header">
          <div class="title-wrap">
            <el-checkbox
              v-model="selectedIds"
              :label="item.id"
              @click.stop
            >{{ '' }}</el-checkbox>
            <span class="title">
              <el-badge v-if="item.is_read === 0" is-dot class="unread-dot" />
              {{ item.title }}
            </span>
          </div>
          <span class="time">{{ formatTime(item.create_time) }}</span>
        </div>
        <div class="card-body">
          <p class="content">{{ item.content }}</p>
        </div>
      </el-card>
    </div>
    <el-pagination
      v-if="total > pageSize"
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="fetchNotifications"
      class="pagination"
    />

    <el-dialog v-model="detailVisible" :title="currentDetail?.title" width="600px">
      <div v-if="currentDetail" class="detail-content">
        <p>{{ currentDetail.content }}</p>
        <div class="detail-time">{{ formatTime(currentDetail.create_time) }}</div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button v-if="currentDetail?.is_read === 0" type="primary" @click="markRead(currentDetail.id)">标记已读</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const notifications = ref([])
const unreadCount = ref(0)
const detailVisible = ref(false)
const currentDetail = ref(null)
const selectedIds = ref([])

const isAllSelected = computed({
  get: () => notifications.value.length > 0 && selectedIds.value.length === notifications.value.length,
  set: (val) => {
    selectedIds.value = val ? notifications.value.map(item => item.id) : []
  }
})

const isIndeterminate = computed(() => {
  return selectedIds.value.length > 0 && selectedIds.value.length < notifications.value.length
})

const fetchNotifications = async () => {
  selectedIds.value = []
  const res = await axios.get('/notifications', {
    params: { page: page.value, pageSize: pageSize.value }
  })
  notifications.value = res.data.notifications
  total.value = res.data.total

  // 进入页面后自动把所有未读消息标记为已读，红点消失
  const hasUnread = notifications.value.some(item => item.is_read === 0)
  if (hasUnread) {
    await axios.put('/notifications/read-all')
    await fetchUnreadCount()
    // 刷新列表状态，去掉未读样式
    const res2 = await axios.get('/notifications', {
      params: { page: page.value, pageSize: pageSize.value }
    })
    notifications.value = res2.data.notifications
  }
}

const fetchUnreadCount = async () => {
  const res = await axios.get('/notifications/unread-count')
  unreadCount.value = res.data.count
}

const showDetail = (item) => {
  currentDetail.value = item
  detailVisible.value = true
}

const markRead = async (id) => {
  await axios.put(`/notifications/${id}/read`)
  ElMessage.success('已标记已读')
  fetchNotifications()
  fetchUnreadCount()
  detailVisible.value = false
}

const markAllRead = async () => {
  await axios.put('/notifications/read-all')
  ElMessage.success('全部已读')
  fetchNotifications()
  fetchUnreadCount()
}

const handleSelectAll = (val) => {
  selectedIds.value = val ? notifications.value.map(item => item.id) : []
}

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的消息')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条消息吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await axios.delete('/notifications', { data: { ids: selectedIds.value } })
    ElMessage.success('删除成功')
    selectedIds.value = []
    fetchNotifications()
    fetchUnreadCount()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchNotifications()
  fetchUnreadCount()
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.empty-tip {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-card.unread {
  background: #f0f9ff;
  border-left: 4px solid #3498db;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-header .title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-header .title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header .time {
  font-size: 13px;
  color: #999;
}

.card-body .content {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.detail-content {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
}

.detail-time {
  margin-top: 20px;
  color: #999;
  font-size: 13px;
  text-align: right;
}
</style>
