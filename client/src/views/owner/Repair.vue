<template>
  <div class="page-container">
    <div class="page-header">
      <h2>报修管理</h2>
      <el-button type="primary" @click="showAddDialog">提交报修</el-button>
    </div>
    <el-table :data="orders" border class="order-table">
      <el-table-column prop="type" label="报修类型" width="100" />
      <el-table-column prop="title" label="工单标题" />
      <el-table-column prop="location" label="地址" width="150" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间" width="180">
        <template #default="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <div class="action-btns">
            <el-button type="primary" size="small" plain @click="viewDetail(row)">详情</el-button>
            <el-button
              v-if="[0, 4].includes(row.status)"
              type="danger"
              size="small"
              plain
              :disabled="row.status === 4"
              @click="handleCancel(row)"
            >{{ row.status === 4 ? '已撤销' : '撤销' }}</el-button>
            <el-button
              v-if="row.status === 3 && !row.rating"
              type="warning"
              size="small"
              plain
              @click="showRateDialog(row)"
            >评价</el-button>
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
    <el-dialog v-model="addVisible" title="提交报修" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="报修类型" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择报修类型">
            <el-option label="水电维修" value="水电维修" />
            <el-option label="管道疏通" value="管道疏通" />
            <el-option label="家电维修" value="家电维修" />
            <el-option label="门窗维修" value="门窗维修" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单标题" prop="title">
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input v-model="addForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="地址" prop="location">
          <el-input v-model="addForm.location" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="rateVisible" title="评价工单" width="400px">
      <el-form ref="rateFormRef" :model="rateForm" :rules="rateRules" label-width="80px">
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="rateForm.rating" :max="5" show-text />
        </el-form-item>
        <el-form-item label="评价内容" prop="feedback">
          <el-input v-model="rateForm.feedback" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rateVisible = false">取消</el-button>
        <el-button type="primary" :loading="rateLoading" @click="handleRate">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import axios from '@/utils/request'

const router = useRouter()
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const orders = ref([])
const addVisible = ref(false)
const rateVisible = ref(false)
const addLoading = ref(false)
const rateLoading = ref(false)
const addFormRef = ref(null)
const rateFormRef = ref(null)
const currentRateOrder = ref(null)

const addForm = reactive({
  type: '',
  title: '',
  description: '',
  location: ''
})

const addRules = {
  type: [{ required: true, message: '请选择报修类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入详细描述', trigger: 'blur' }],
  location: [{ required: true, message: '请输入地址', trigger: 'blur' }]
}

const rateForm = reactive({
  rating: 5,
  feedback: ''
})

const rateRules = {
  rating: [{ required: true, message: '请选择评分', trigger: 'change' }]
}

const fetchOrders = async () => {
  const res = await axios.get('/repair-orders/owner', {
    params: { page: page.value, pageSize: pageSize.value }
  })
  orders.value = res.data.orders
  total.value = res.data.total
}

const handlePageChange = (val) => {
  fetchOrders()
}

const showAddDialog = () => {
  addForm.type = ''
  addForm.title = ''
  addForm.description = ''
  addForm.location = ''
  addVisible.value = true
}

const handleAdd = async () => {
  const valid = await addFormRef.value.validate()
  if (!valid) return

  addLoading.value = true
  try {
    await axios.post('/repair-orders', addForm)
    addVisible.value = false
    fetchOrders()
  } finally {
    addLoading.value = false
  }
}

const viewDetail = (row) => {
  router.push(`/owner/repair/detail/${row.id}`)
}

const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm('确定要撤销该报修工单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await axios.put(`/repair-orders/${row.id}/cancel`)
    fetchOrders()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const showRateDialog = (row) => {
  currentRateOrder.value = row
  rateForm.rating = 5
  rateForm.feedback = ''
  rateVisible.value = true
}

const handleRate = async () => {
  const valid = await rateFormRef.value.validate()
  if (!valid) return

  rateLoading.value = true
  try {
    await axios.put(`/repair-orders/${currentRateOrder.value.id}/rate`, rateForm)
    rateVisible.value = false
    fetchOrders()
  } finally {
    rateLoading.value = false
  }
}

const getStatusText = (status) => {
  const map = { 0: '待分派', 1: '待接单', 2: '处理中', 3: '已完成', 4: '已撤销' }
  return map[status] || '未知'
}

const getStatusType = (status) => {
  const map = { 0: 'warning', 1: 'info', 2: 'primary', 3: 'success', 4: 'info' }
  return map[status] || 'default'
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchOrders()
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

.order-table {
  width: 100%;
}

.action-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
