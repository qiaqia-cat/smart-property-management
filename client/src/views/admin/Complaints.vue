<template>
  <div class="page-container">
    <div class="page-header">
      <h2>投诉管理</h2>
      <el-select v-model="status" placeholder="状态筛选" style="width: 140px; flex-shrink: 0;" @change="handleStatusChange">
        <el-option label="全部" :value="-1" />
        <el-option label="待处理" :value="0" />
        <el-option label="已处理" :value="1" />
      </el-select>
    </div>
    <el-table :data="complaints" border class="complaint-table">
      <el-table-column prop="id" label="编号" min-width="70" />
      <el-table-column prop="type" label="类型" min-width="90" />
      <el-table-column prop="title" label="标题" min-width="180" />
      <el-table-column prop="content" label="投诉内容" min-width="240">
        <template #default="{ row }">
          <el-tooltip :content="row.content" placement="top" :show-overflow-tooltip="true">
            <span class="content-ellipsis">{{ row.content }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="owner.name" label="业主" min-width="100" />
      <el-table-column prop="status" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'warning' : 'success'">
            {{ row.status === 0 ? '待处理' : '已处理' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间" min-width="180">
        <template #default="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template #default="{ row }">
          <div class="action-btns">
            <el-button v-if="row.status === 0" type="primary" size="small" plain @click="showHandleDialog(row)">处理</el-button>
            <el-button v-if="row.status === 1" type="danger" size="small" plain @click="deleteComplaint(row)">删除</el-button>
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
    <el-dialog v-model="handleVisible" title="处理投诉" width="500px">
      <el-form ref="handleFormRef" :model="handleForm" :rules="handleRules" label-width="80px">
        <el-form-item label="处理结果" prop="handle_result">
          <el-input v-model="handleForm.handle_result" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleComplaint">确认处理</el-button>
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
const complaints = ref([])
const status = ref(-1)
const handleVisible = ref(false)
const loading = ref(false)
const handleFormRef = ref(null)
const currentComplaint = ref(null)

const handleForm = reactive({
  handle_result: ''
})

const handleRules = {
  handle_result: [{ required: true, message: '请输入处理结果', trigger: 'blur' }]
}

const fetchComplaints = async () => {
  const params = { page: page.value, pageSize: pageSize.value }
  if (status.value !== -1) {
    params.status = status.value
  }
  const res = await axios.get('/complaints/all', { params })
  complaints.value = res.data.complaints
  total.value = res.data.total
}

const handlePageChange = (val) => {
  fetchComplaints()
}

const handleStatusChange = () => {
  page.value = 1
  fetchComplaints()
}

const showHandleDialog = (row) => {
  currentComplaint.value = row
  handleForm.handle_result = ''
  handleVisible.value = true
}

const handleComplaint = async () => {
  const valid = await handleFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await axios.put(`/complaints/${currentComplaint.value.id}/handle`, handleForm)
    ElMessage.success('处理成功')
    handleVisible.value = false
    fetchComplaints()
  } finally {
    loading.value = false
  }
}

const deleteComplaint = (row) => {
  if (row.status !== 1) {
    ElMessage.warning('只有已处理的投诉才可以删除')
    return
  }
  ElMessageBox.confirm('确认删除该投诉记录？删除后不可恢复', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await axios.delete(`/complaints/${row.id}`)
    ElMessage.success('删除成功')
    fetchComplaints()
  }).catch(() => {})
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
  white-space: nowrap;
  line-height: 1;
}

.complaint-table {
  width: 100%;
}

.action-btns {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
}

.content-ellipsis {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
