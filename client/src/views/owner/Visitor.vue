<template>
  <div class="page-container">
      <div class="page-header">
      <h2>访客管理</h2>
      <el-button type="primary" plain @click="showAddDialog">新增访客</el-button>
    </div>
    <el-table :data="visitors" border class="visitor-table">
      <el-table-column prop="visitor_name" label="访客姓名" min-width="120" />
      <el-table-column prop="visitor_phone" label="联系电话" min-width="130" />
      <el-table-column prop="visit_time" label="来访时间" min-width="180">
        <template #default="{ row }">
          {{ formatTime(row.visit_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="pass_code" label="通行码" min-width="100">
        <template #default="{ row }">
          <el-tag type="info">{{ row.pass_code }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'warning' : 'success'">
            {{ row.status === 0 ? '待到访' : '已到访' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" plain @click="showEditDialog(row)">修改</el-button>
          <el-button type="danger" size="small" plain @click="handleDelete(row)">删除</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="450px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="访客姓名" prop="visitor_name">
          <el-input v-model="form.visitor_name" />
        </el-form-item>
        <el-form-item label="联系电话" prop="visitor_phone">
          <el-input v-model="form.visitor_phone" />
        </el-form-item>
        <el-form-item label="来访时间" prop="visit_time">
          <el-date-picker v-model="form.visit_time" type="datetime" placeholder="选择来访时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const visitors = ref([])
const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const isEdit = ref(false)
const currentId = ref(null)

const dialogTitle = computed(() => isEdit.value ? '修改访客' : '访客登记')

const form = reactive({
  visitor_name: '',
  visitor_phone: '',
  visit_time: ''
})

const rules = {
  visitor_name: [{ required: true, message: '请输入访客姓名', trigger: 'blur' }],
  visitor_phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  visit_time: [{ required: true, message: '请选择来访时间', trigger: 'change' }]
}

const fetchVisitors = async () => {
  const res = await axios.get('/visitors/owner', {
    params: { page: page.value, pageSize: pageSize.value }
  })
  const list = res.data.visitors || []
  visitors.value = list.sort((a, b) => a.id - b.id)
  total.value = res.data.total
}

const handlePageChange = (val) => {
  fetchVisitors()
}

const resetForm = () => {
  form.visitor_name = ''
  form.visitor_phone = ''
  form.visit_time = ''
  currentId.value = null
  isEdit.value = false
}

const showAddDialog = () => {
  resetForm()
  dialogVisible.value = true
}

const showEditDialog = (row) => {
  resetForm()
  isEdit.value = true
  currentId.value = row.id
  form.visitor_name = row.visitor_name
  form.visitor_phone = row.visitor_phone
  form.visit_time = row.visit_time
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    if (isEdit.value) {
      await axios.put(`/visitors/${currentId.value}`, form)
      ElMessage.success('修改成功')
    } else {
      await axios.post('/visitors', form)
      ElMessage.success('登记成功')
    }
    dialogVisible.value = false
    fetchVisitors()
  } finally {
    loading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该访客记录？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await axios.delete(`/visitors/${row.id}`)
    ElMessage.success('删除成功')
    fetchVisitors()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchVisitors()
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

.visitor-table {
  width: 100%;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
