<template>
  <div class="page-container">
    <div class="page-header">
      <h2>公告管理</h2>
      <el-button type="primary" @click="showAddDialog">发布公告</el-button>
    </div>
    <el-table :data="announcements" border class="announcement-table">
      <el-table-column prop="id" label="编号" min-width="70" />
      <el-table-column prop="title" label="标题" min-width="240" />
      <el-table-column prop="type" label="类型" min-width="100">
        <template #default="{ row }">
          <el-tag type="info">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publisher.name" label="发布人" min-width="100" />
      <el-table-column prop="create_time" label="发布时间" min-width="180">
        <template #default="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="220" fixed="right">
        <template #default="{ row }">
          <div class="action-btns">
            <el-button type="primary" size="small" plain @click="showDetail(row)">详情</el-button>
            <el-button type="warning" size="small" plain @click="showEditDialog(row)">修改</el-button>
            <el-button type="danger" size="small" plain @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
      class="pagination"
    />
    <el-dialog v-model="formVisible" :title="isEdit ? '修改公告' : '发布公告'" width="500px">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="通知" value="通知" />
            <el-option label="公告" value="公告" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">{{ isEdit ? '保存' : '发布' }}</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="detailVisible" title="公告详情" width="600px">
      <div class="detail-content" v-if="currentDetail">
        <h3 class="detail-title">{{ currentDetail.title }}</h3>
        <div class="detail-meta">
          <el-tag type="info" size="small">{{ currentDetail.type }}</el-tag>
          <span>发布人：{{ currentDetail.publisher?.name }}</span>
          <span>发布时间：{{ formatTime(currentDetail.create_time) }}</span>
        </div>
        <div class="detail-body">{{ currentDetail.content }}</div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const announcements = ref([])
const formVisible = ref(false)
const detailVisible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const isEdit = ref(false)
const currentEditId = ref(null)
const currentDetail = ref(null)

const form = reactive({
  title: '',
  type: '',
  content: ''
})

const formRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

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

const resetForm = () => {
  form.title = ''
  form.type = ''
  form.content = ''
  currentEditId.value = null
  isEdit.value = false
}

const showAddDialog = () => {
  resetForm()
  formVisible.value = true
}

const showEditDialog = (row) => {
  resetForm()
  isEdit.value = true
  currentEditId.value = row.id
  form.title = row.title
  form.type = row.type
  form.content = row.content
  formVisible.value = true
}

const submitForm = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    if (isEdit.value) {
      await axios.put(`/announcements/${currentEditId.value}`, form)
      ElMessage.success('修改成功')
    } else {
      await axios.post('/announcements', form)
      ElMessage.success('发布成功')
    }
    formVisible.value = false
    fetchAnnouncements()
  } finally {
    loading.value = false
  }
}

const showDetail = async (row) => {
  try {
    const res = await axios.get(`/announcements/${row.id}`)
    currentDetail.value = res.data
    detailVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该公告？删除后不可恢复', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await axios.delete(`/announcements/${row.id}`)
    ElMessage.success('删除成功')
    fetchAnnouncements()
  }).catch(() => {})
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
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 16px;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
  white-space: nowrap;
  line-height: 1;
}

.announcement-table {
  width: 100%;
}

.action-btns {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.detail-content {
  padding: 10px 0;
}

.detail-title {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #333;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.detail-body {
  font-size: 15px;
  line-height: 1.8;
  color: #444;
  white-space: pre-wrap;
  word-break: break-all;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}
</style>
