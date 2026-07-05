<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="hero-content">
        <h2 class="hero-title">系统公告</h2>
        <p class="hero-subtitle">欢迎回家，及时了解小区最新通知与动态</p>
      </div>
    </div>

    <div class="content-section">
      <div class="announcement-list">
        <el-card v-for="item in announcements" :key="item.id" class="announcement-card" @click="showDetail(item)">
          <div class="card-header">
            <span class="title">{{ item.title }}</span>
            <span class="type">{{ item.type }}</span>
          </div>
          <div class="card-body">
            <p class="content">{{ item.content.slice(0, 100) }}...</p>
          </div>
          <div class="card-footer">
            <span class="publisher">发布人：{{ item.publisher?.name }}</span>
            <span class="time">{{ formatTime(item.create_time) }}</span>
          </div>
        </el-card>
      </div>

      <el-pagination
        v-if="total > pageSize"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        class="pagination"
      />
    </div>

    <el-dialog v-model="detailVisible" :title="currentDetail?.title" width="600px" class="announcement-dialog">
      <div v-if="currentDetail">
        <div class="detail-info">
          <span class="detail-type">{{ currentDetail.type }}</span>
          <span class="detail-time">{{ formatTime(currentDetail.create_time) }}</span>
          <span class="detail-publisher">发布人：{{ currentDetail.publisher?.name }}</span>
        </div>
        <div class="detail-content">
          <p>{{ currentDetail.content }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/request'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const announcements = ref([])
const detailVisible = ref(false)
const currentDetail = ref(null)

const fetchAnnouncements = async () => {
  const res = await axios.get('/announcements/all', {
    params: { page: page.value, pageSize: pageSize.value }
  })
  announcements.value = res.data.announcements
  total.value = res.data.total
}

const handlePageChange = (val) => {
  fetchAnnouncements()
}

const showDetail = (item) => {
  currentDetail.value = item
  detailVisible.value = true
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchAnnouncements()
})
</script>

<style scoped>
.home-container {
  margin: -24px -32px -40px;
  min-height: calc(100vh - 64px);
}

.hero-section {
  position: relative;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('/owner-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(93, 64, 55, 0.38) 0%,
    rgba(141, 110, 99, 0.42) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-title {
  font-size: 38px;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: 4px;
}

.hero-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.95;
  letter-spacing: 1px;
}

.content-section {
  padding: 28px 32px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.announcement-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.announcement-card {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(93, 64, 55, 0.08);
  transition: transform 0.25s, box-shadow 0.25s;
}

.announcement-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(93, 64, 55, 0.14);
}

.announcement-card :deep(.el-card__body) {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-header .title {
  font-size: 17px;
  font-weight: 700;
  color: #5d4037;
  line-height: 1.4;
  flex: 1;
  padding-right: 12px;
}

.card-header .type {
  flex-shrink: 0;
  background: #d35400;
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.card-body .content {
  color: #8d6e63;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(215, 204, 200, 0.6);
}

.card-footer .publisher,
.card-footer .time {
  font-size: 12px;
  color: #a1887f;
}

.pagination {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-pagination .el-pager li.is-active) {
  background: #d35400 !important;
  color: #fff !important;
}

:deep(.el-pagination .el-pager li:hover) {
  color: #d35400;
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover) {
  color: #d35400;
}

.detail-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(215, 204, 200, 0.6);
}

.detail-type {
  background: #d35400;
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.detail-time,
.detail-publisher {
  font-size: 13px;
  color: #8d6e63;
}

.detail-content {
  font-size: 15px;
  line-height: 1.9;
  color: #5d4037;
}

:deep(.announcement-dialog .el-dialog__title) {
  color: #5d4037;
  font-weight: 700;
}

:deep(.announcement-dialog .el-dialog__header) {
  border-bottom: 1px solid rgba(215, 204, 200, 0.6);
  margin-right: 0;
  padding: 18px 24px;
}

:deep(.announcement-dialog .el-dialog__body) {
  padding: 20px 24px;
}

@media (max-width: 768px) {
  .hero-section {
    height: 180px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .content-section {
    padding: 20px 16px 32px;
  }

  .announcement-list {
    grid-template-columns: 1fr;
  }
}
</style>
