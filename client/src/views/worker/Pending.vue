<template>
  <div class="page-container">
    <div class="page-header">
      <h2>待办工单</h2>
      <el-select v-model="status" placeholder="状态筛选" style="width: 140px;" @change="handleStatusChange">
        <el-option label="全部" :value="-1" />
        <el-option label="待接单" :value="1" />
        <el-option label="处理中" :value="2" />
      </el-select>
    </div>
    <el-table :data="orders" border>
      <el-table-column prop="title" label="工单标题" min-width="140" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ getTypeText(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="位置" min-width="150" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业主" width="100">
        <template #default="{ row }">
          {{ row.owner?.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间" width="170">
        <template #default="{ row }">
          {{ formatDate(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status === 1" type="primary" size="small" @click="acceptOrder(row.id)">接单</el-button>
          <el-button v-if="row.status === 2" type="success" size="small" @click="showCompleteDialog(row)">完工</el-button>
          <el-button type="info" size="small" @click="viewDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-model:current-page="page"
      :page-sizes="[10, 20, 50]"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    />

    <el-dialog title="工单详情" v-model="detailDialogVisible" width="600px">
      <div v-if="selectedOrder" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单标题">{{ selectedOrder.title }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ getTypeText(selectedOrder.type) }}</el-descriptions-item>
          <el-descriptions-item label="位置">{{ selectedOrder.location }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ getStatusText(selectedOrder.status) }}</el-descriptions-item>
          <el-descriptions-item label="业主">{{ selectedOrder.owner?.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="业主电话">{{ selectedOrder.owner?.phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ formatDate(selectedOrder.create_time) }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ formatDate(selectedOrder.finish_time) }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ selectedOrder.description }}</el-descriptions-item>
          <el-descriptions-item v-if="selectedOrder.repair_result" label="维修结果" :span="2">{{ selectedOrder.repair_result }}</el-descriptions-item>
        </el-descriptions>
        <div v-if="selectedOrder.repair_img" class="repair-img">
          <img :src="selectedOrder.repair_img" alt="维修图片" />
        </div>
      </div>
    </el-dialog>

    <el-dialog title="完工提交" v-model="completeDialogVisible" width="500px">
      <el-form :model="completeForm" label-width="80px">
        <el-form-item label="维修结果" required>
          <el-input v-model="completeForm.repair_result" type="textarea" rows="4" placeholder="请描述维修结果" />
        </el-form-item>
        <el-form-item label="维修图片">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
            :file-list="fileList"
            accept="image/*"
            :limit="1"
            list-type="picture"
          >
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="completeDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="completing" @click="submitComplete">确认完工</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/request'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const status = ref(-1)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const orders = ref([])
const detailDialogVisible = ref(false)
const completeDialogVisible = ref(false)
const selectedOrder = ref(null)
const completingOrderId = ref(null)
const completing = ref(false)
const fileList = ref([])
const completeForm = ref({ repair_result: '', repair_img: '' })
const uploadUrl = '/api/repair-orders/upload'
const uploadHeaders = { Authorization: 'Bearer ' + userStore.token }

const getTypeText = (type) => {
  const map = { 1: '水电维修', 2: '家电维修', 3: '管道疏通', 4: '门窗维修', 5: '其他' }
  return map[type] || '其他'
}

const getStatusText = (status) => {
  const map = { 1: '待接单', 2: '处理中', 3: '已完成' }
  return map[status] || '未知'
}

const getStatusType = (status) => {
  const map = { 1: 'warning', 2: 'primary', 3: 'success' }
  return map[status] || 'info'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

const fetchOrders = async () => {
  try {
      const res = await axios.get('/repair-orders/worker/pending', {
        params: { page: page.value, pageSize: pageSize.value, status: status.value }
      })
      if (res.code === 200) {
        orders.value = res.data.orders || []
        total.value = res.data.total || 0
      }
  } catch (e) {
    ElMessage.error('获取工单列表失败')
  }
}

const acceptOrder = async (id) => {
  try {
    const res = await axios.put(`/repair-orders/${id}/accept`)
    if (res.code === 200) {
      ElMessage.success('接单成功')
      fetchOrders()
    }
  } catch (e) {
    ElMessage.error('接单失败')
  }
}

const viewDetail = (order) => {
  selectedOrder.value = order
  detailDialogVisible.value = true
}

const showCompleteDialog = (order) => {
  selectedOrder.value = order
  completingOrderId.value = order.id
  completeForm.value = { repair_result: '', repair_img: '' }
  fileList.value = []
  completeDialogVisible.value = true
}

const handleUploadSuccess = (res) => {
  if (res.code === 200) {
    completeForm.value.repair_img = res.data.url
    ElMessage.success('图片上传成功')
  }
}

const handleUploadError = () => {
  ElMessage.error('图片上传失败')
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  return true
}

const submitComplete = async () => {
  if (!completeForm.value.repair_result.trim()) {
    ElMessage.warning('请填写维修结果')
    return
  }
  completing.value = true
  try {
    const res = await axios.put(`/repair-orders/${completingOrderId.value}/complete`, completeForm.value)
    if (res.code === 200) {
      ElMessage.success('完工提交成功')
      completeDialogVisible.value = false
      fetchOrders()
    }
  } catch (e) {
    ElMessage.error('提交失败')
  } finally {
    completing.value = false
  }
}

const handleStatusChange = () => {
  page.value = 1
  fetchOrders()
}

const handleSizeChange = (size) => {
  page.value = 1
  fetchOrders()
}

const handleCurrentChange = (currentPage) => {
  fetchOrders()
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
  flex-wrap: nowrap;
  gap: 16px;
}

.page-header h2 {
  margin: 0;
  white-space: nowrap;
  line-height: 1;
}

.detail-content {
  padding: 10px;
}

.repair-img {
  margin-top: 16px;
}

.repair-img img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
}

.upload-demo {
  width: 100%;
}
</style>