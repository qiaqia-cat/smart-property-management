<template>
  <div class="page-container">
    <div class="page-header">
      <h2>工单管理</h2>
      <el-select v-model="status" placeholder="状态筛选" style="width: 140px;" @change="handleStatusChange">
        <el-option label="全部" :value="-1" />
        <el-option label="待分派" :value="0" />
        <el-option label="待接单" :value="1" />
        <el-option label="处理中" :value="2" />
        <el-option label="已完成" :value="3" />
        <el-option label="已撤销" :value="4" />
      </el-select>
    </div>
    <el-table :data="orders" border class="order-table">
      <el-table-column prop="id" label="工单编号" width="90" />
      <el-table-column prop="type" label="报修类型" width="100" />
      <el-table-column prop="title" label="工单标题" min-width="180" />
      <el-table-column prop="location" label="地址" width="150" />
      <el-table-column prop="owner.name" label="业主" width="100" />
      <el-table-column prop="worker.name" label="工人" width="100">
        <template #default="{ row }">
          {{ row.worker?.name || '-' }}
        </template>
      </el-table-column>
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
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <div class="action-btns">
            <el-button type="primary" size="small" plain @click="viewDetail(row)">详情</el-button>
            <el-button
              :type="row.status === 0 ? 'primary' : 'info'"
              size="small"
              plain
              :disabled="row.status !== 0"
              @click="row.status === 0 && showAssignDialog(row)"
            >
              {{ row.status === 0 ? '分派' : row.status === 4 ? '已撤销' : '已分派' }}
            </el-button>
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
    <el-dialog v-model="assignVisible" title="分派工人" width="400px">
      <el-form ref="assignFormRef" :model="assignForm" :rules="assignRules" label-width="80px">
        <el-form-item label="工人" prop="worker_id">
          <el-select v-model="assignForm.worker_id" placeholder="请选择工人">
            <el-option v-for="worker in workers" :key="worker.id" :label="worker.name" :value="worker.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleAssign">确认分派</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="detailVisible" title="工单详情" width="600px">
      <el-card v-if="currentDetail" class="detail-card">
        <div class="detail-row">
          <span class="label">工单编号</span>
          <span class="value">{{ currentDetail.id }}</span>
        </div>
        <div class="detail-row">
          <span class="label">报修类型</span>
          <span class="value">{{ currentDetail.type }}</span>
        </div>
        <div class="detail-row">
          <span class="label">工单标题</span>
          <span class="value">{{ currentDetail.title }}</span>
        </div>
        <div class="detail-row">
          <span class="label">详细描述</span>
          <span class="value">{{ currentDetail.description }}</span>
        </div>
        <div class="detail-row">
          <span class="label">地址</span>
          <span class="value">{{ currentDetail.location }}</span>
        </div>
        <div class="detail-row">
          <span class="label">状态</span>
          <el-tag :type="getStatusType(currentDetail.status)">{{ getStatusText(currentDetail.status) }}</el-tag>
        </div>
        <div class="detail-row" v-if="currentDetail.owner">
          <span class="label">业主</span>
          <span class="value">{{ currentDetail.owner.name }} {{ currentDetail.owner.phone ? '(' + currentDetail.owner.phone + ')' : '' }}</span>
        </div>
        <div class="detail-row" v-if="currentDetail.worker">
          <span class="label">维修工人</span>
          <span class="value">{{ currentDetail.worker.name }}（{{ currentDetail.worker.skill }}）</span>
        </div>
        <div class="detail-row" v-if="currentDetail.repair_result">
          <span class="label">维修结果</span>
          <span class="value">{{ currentDetail.repair_result }}</span>
        </div>
        <div class="detail-row" v-if="currentDetail.repair_img">
          <span class="label">维修图片</span>
          <div class="value">
            <img :src="currentDetail.repair_img" alt="维修图片" class="repair-img" @click="previewImage(currentDetail.repair_img)" />
          </div>
        </div>
        <div class="detail-row" v-if="currentDetail.rating">
          <span class="label">评分</span>
          <el-rate :model-value="toDisplayRating(currentDetail.rating)" :max="5" disabled />
        </div>
        <div class="detail-row" v-if="currentDetail.feedback">
          <span class="label">评价内容</span>
          <span class="value">{{ currentDetail.feedback }}</span>
        </div>
        <div class="detail-row">
          <span class="label">提交时间</span>
          <span class="value">{{ formatTime(currentDetail.create_time) }}</span>
        </div>
        <div class="detail-row" v-if="currentDetail.finish_time">
          <span class="label">完成时间</span>
          <span class="value">{{ formatTime(currentDetail.finish_time) }}</span>
        </div>
      </el-card>
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
const orders = ref([])
const status = ref(-1)
const workers = ref([])
const assignVisible = ref(false)
const detailVisible = ref(false)
const loading = ref(false)
const assignFormRef = ref(null)
const currentOrder = ref(null)
const currentDetail = ref(null)

const assignForm = reactive({
  worker_id: ''
})

const assignRules = {
  worker_id: [{ required: true, message: '请选择工人', trigger: 'change' }]
}

const fetchOrders = async () => {
  const params = { page: page.value, pageSize: pageSize.value }
  if (status.value !== -1) {
    params.status = status.value
  }
  const res = await axios.get('/repair-orders/all', { params })
  orders.value = res.data.orders
  total.value = res.data.total
}

const fetchWorkers = async () => {
  const res = await axios.get('/users/workers')
  workers.value = res.data
}

const handlePageChange = (val) => {
  fetchOrders()
}

const handleStatusChange = () => {
  page.value = 1
  fetchOrders()
}

const showAssignDialog = (row) => {
  currentOrder.value = row
  assignForm.worker_id = ''
  assignVisible.value = true
}

const handleAssign = async () => {
  const valid = await assignFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await axios.put(`/repair-orders/${currentOrder.value.id}/assign`, assignForm)
    assignVisible.value = false
    fetchOrders()
  } finally {
    loading.value = false
  }
}

const viewDetail = async (row) => {
  try {
    const res = await axios.get(`/repair-orders/${row.id}`)
    currentDetail.value = res.data
    detailVisible.value = true
  } catch (e) {
    ElMessage.error('获取详情失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该工单？删除后不可恢复。', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await axios.delete(`/repair-orders/${row.id}`)
    ElMessage.success('删除成功')
    fetchOrders()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const previewImage = (url) => {
  window.open(url, '_blank')
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

const toDisplayRating = (r) => {
  if (!r) return 0
  return r > 5 ? Math.round(r / 2 * 10) / 10 : r
}

onMounted(() => {
  fetchOrders()
  fetchWorkers()
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

.order-table {
  width: 100%;
}

.action-btns {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: flex-start;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.detail-card {
  border: none;
  box-shadow: none;
}

.detail-row {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  width: 100px;
  font-weight: bold;
  color: #666;
}

.detail-row .value {
  flex: 1;
  color: #333;
  word-break: break-all;
}

.repair-img {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.repair-img:hover {
  transform: scale(1.02);
}
</style>
