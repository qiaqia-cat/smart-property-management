<template>
  <div class="page-container">
    <div class="page-header">
      <h2>投诉建议</h2>
      <el-button type="primary" @click="showAddDialog">提交投诉</el-button>
    </div>
    <el-table :data="complaints" border class="complaint-table">
      <el-table-column prop="type" label="类型" width="90" />
      <el-table-column prop="title" label="标题" min-width="260" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'warning' : 'success'">
            {{ row.status === 0 ? '待处理' : '已处理' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间" width="180">
        <template #default="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link @click="viewDetail(row)">详情</el-button>
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
    <el-dialog v-model="addVisible" title="提交投诉" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择类型">
            <el-option label="投诉" value="投诉" />
            <el-option label="建议" value="建议" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="addForm.content" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/utils/request'

const router = useRouter()
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const complaints = ref([])
const addVisible = ref(false)
const loading = ref(false)
const addFormRef = ref(null)

const addForm = reactive({
  type: '',
  title: '',
  content: ''
})

const addRules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

const fetchComplaints = async () => {
  const res = await axios.get('/complaints/owner', {
    params: { page: page.value, pageSize: pageSize.value }
  })
  complaints.value = res.data.complaints
  total.value = res.data.total
}

const handlePageChange = (val) => {
  fetchComplaints()
}

const showAddDialog = () => {
  addForm.type = ''
  addForm.title = ''
  addForm.content = ''
  addVisible.value = true
}

const handleAdd = async () => {
  const valid = await addFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await axios.post('/complaints', addForm)
    addVisible.value = false
    fetchComplaints()
  } finally {
    loading.value = false
  }
}

const viewDetail = (row) => {
  router.push(`/owner/complaint/detail/${row.id}`)
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchComplaints()
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
  line-height: 1;
  white-space: nowrap;
}

.complaint-table {
  width: 100%;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
