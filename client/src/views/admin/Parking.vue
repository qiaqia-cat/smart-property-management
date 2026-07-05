<template>
  <div class="page-container">
    <div class="page-header">
      <h2>停车管理</h2>
      <el-button type="primary" @click="openAddDialog">入场登记</el-button>
    </div>
    <el-table :data="parkingList" border>
      <el-table-column prop="car_number" label="车牌号" min-width="140" />
      <el-table-column prop="parking_space" label="车位号" min-width="100" />
      <el-table-column prop="entry_time" label="入场时间" min-width="180">
        <template #default="{ row }">
          {{ formatDate(row.entry_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="exit_time" label="离场时间" min-width="180">
        <template #default="{ row }">
          {{ row.exit_time ? formatDate(row.exit_time) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'primary' : 'success'" size="small">
            {{ row.status === 0 ? '停车中' : '已离场' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <div class="action-btns">
            <el-button type="primary" size="small" plain @click="openDetailDialog(row)">详情</el-button>
            <el-button type="warning" size="small" plain @click="openEditDialog(row)">编辑</el-button>
            <el-button
              :type="row.status === 0 ? 'success' : 'info'"
              size="small"
              plain
              :disabled="row.status === 1"
              @click="exitParking(row.id)"
            >离场</el-button>
            <el-button type="danger" size="small" plain @click="deleteParking(row.id)">删除</el-button>
          </div>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="isEdit ? '编辑停车记录' : '车辆入场登记'" v-model="showDialog" width="450px">
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="车牌号" prop="car_number">
          <el-input v-model="form.car_number" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="车位号" prop="parking_space">
          <el-input v-model="form.parking_space" placeholder="请输入车位号" />
        </el-form-item>
        <el-form-item v-if="isEdit" label="入场时间" prop="entry_time">
          <el-date-picker
            v-model="form.entry_time"
            type="datetime"
            placeholder="选择入场时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item v-if="isEdit" label="离场时间" prop="exit_time">
          <el-date-picker
            v-model="form.exit_time"
            type="datetime"
            placeholder="选择离场时间（未离场可不填）"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="isEdit" label="状态" prop="status">
          <el-select v-model="form.status" placeholder="选择状态" style="width: 100%">
            <el-option label="停车中" :value="0" />
            <el-option label="已离场" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="停车记录详情" v-model="showDetailDialog" width="500px">
      <el-form label-width="100px" v-if="detail">
        <el-form-item label="车牌号">
          <span>{{ detail.car_number }}</span>
        </el-form-item>
        <el-form-item label="车位号">
          <span>{{ detail.parking_space }}</span>
        </el-form-item>
        <el-form-item label="入场时间">
          <span>{{ formatDate(detail.entry_time) }}</span>
        </el-form-item>
        <el-form-item label="离场时间">
          <span>{{ detail.exit_time ? formatDate(detail.exit_time) : '-' }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag :type="detail.status === 0 ? 'primary' : 'success'" size="small">
            {{ detail.status === 0 ? '停车中' : '已离场' }}
          </el-tag>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const parkingList = ref([])
const showDialog = ref(false)
const showDetailDialog = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const detail = ref(null)
const formRef = ref(null)

const form = reactive({
  car_number: '',
  parking_space: '',
  entry_time: '',
  exit_time: '',
  status: 0
})

const rules = {
  car_number: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
  parking_space: [{ required: true, message: '请输入车位号', trigger: 'blur' }]
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

const resetForm = () => {
  form.car_number = ''
  form.parking_space = ''
  form.entry_time = ''
  form.exit_time = ''
  form.status = 0
  currentId.value = null
}

const openAddDialog = () => {
  isEdit.value = false
  resetForm()
  showDialog.value = true
}

const openEditDialog = (row) => {
  isEdit.value = true
  resetForm()
  currentId.value = row.id
  form.car_number = row.car_number
  form.parking_space = row.parking_space
  form.entry_time = row.entry_time ? toDatetimeLocal(row.entry_time) : ''
  form.exit_time = row.exit_time ? toDatetimeLocal(row.exit_time) : ''
  form.status = row.status
  showDialog.value = true
}

const toDatetimeLocal = (date) => {
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const openDetailDialog = async (row) => {
  try {
    const res = await axios.get(`/parkings/${row.id}`)
    if (res.code === 200) {
      detail.value = res.data
      showDetailDialog.value = true
    }
  } catch (e) {
    ElMessage.error('获取详情失败')
  }
}

const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      let res
      if (isEdit.value) {
        const payload = {
          car_number: form.car_number,
          parking_space: form.parking_space,
          entry_time: form.entry_time,
          exit_time: form.exit_time,
          status: form.status
        }
        res = await axios.put(`/parkings/${currentId.value}`, payload)
      } else {
        res = await axios.post('/parkings', {
          car_number: form.car_number,
          parking_space: form.parking_space
        })
      }
      if (res.code === 200) {
        ElMessage.success(isEdit.value ? '编辑成功' : '登记成功')
        showDialog.value = false
        resetForm()
        fetchParking()
      }
    } catch (e) {
      ElMessage.error(isEdit.value ? '编辑失败' : '登记失败')
    } finally {
      submitting.value = false
    }
  })
}

const fetchParking = async () => {
  try {
    const res = await axios.get('/parkings', {
      params: { page: page.value, pageSize: pageSize.value }
    })
    if (res.code === 200) {
      parkingList.value = res.data.parkings
      total.value = res.data.total
    }
  } catch (e) {
    ElMessage.error('获取停车记录失败')
  }
}

const exitParking = async (id) => {
  try {
    await ElMessageBox.confirm('确认该车辆离场？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await axios.put(`/parkings/${id}/exit`)
    if (res.code === 200) {
      ElMessage.success('离场成功')
      fetchParking()
    }
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const deleteParking = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该停车记录？删除后不可恢复', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await axios.delete(`/parkings/${id}`)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchParking()
    }
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSizeChange = (size) => {
  page.value = 1
  fetchParking()
}

const handleCurrentChange = (currentPage) => {
  fetchParking()
}

onMounted(() => {
  fetchParking()
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
  margin: 0;
  white-space: nowrap;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.action-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.action-btns .el-button {
  flex: 0 0 calc(50% - 3px);
  margin: 0;
}
</style>