<template>
  <div class="page-container">
    <div class="page-header">
      <h2>费用管理</h2>
      <el-button type="primary" @click="showGenerateDialog = true">批量生成账单</el-button>
    </div>
    <el-table :data="fees" border>
      <el-table-column label="业主姓名">
        <template #default="{ row }">
          {{ row.owner?.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="业主电话">
        <template #default="{ row }">
          {{ row.owner?.phone || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="fee_type" label="费用类型" width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ getFeeTypeText(row.fee_type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="100">
        <template #default="{ row }">
          ¥{{ (Number(row.amount) || 0).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="billing_cycle" label="计费周期" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'danger' : 'success'" size="small">
            {{ row.status === 0 ? '待缴费' : '已缴费' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_remind" label="催缴状态" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.is_remind === 1" type="warning" size="small">已催缴</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="pay_time" label="缴费时间" width="180">
        <template #default="{ row }">
          {{ row.pay_time ? formatDate(row.pay_time) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="生成时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ row }">
          <el-button
            type="warning"
            size="small"
            plain
            :disabled="row.status !== 0 || row.is_remind === 1"
            @click="remindFee(row.id)"
          >
            {{ row.is_remind === 1 ? '已催缴' : '催缴' }}
          </el-button>
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

    <el-dialog title="批量生成账单" v-model="showGenerateDialog" width="500px">
      <el-form :model="generateForm" label-width="100px">
        <el-form-item label="费用类型" required>
          <el-select v-model="generateForm.fee_type" placeholder="请选择费用类型">
            <el-option label="物业费" :value="1" />
            <el-option label="水电费" :value="2" />
            <el-option label="停车费" :value="3" />
            <el-option label="其他费用" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="计费周期" required>
          <el-input v-model="generateForm.billing_cycle" placeholder="例如：2024年1月" />
        </el-form-item>
        <el-form-item label="金额" required>
          <el-input v-model.number="generateForm.amount" type="number" placeholder="请输入金额" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showGenerateDialog = false">取消</el-button>
        <el-button type="primary" :loading="generating" @click="generateFees">确认生成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const fees = ref([])
const showGenerateDialog = ref(false)
const generating = ref(false)
const generateForm = ref({ fee_type: 1, billing_cycle: '', amount: 0 })

const getFeeTypeText = (type) => {
  const map = { 1: '物业费', 2: '水电费', 3: '停车费', 4: '其他费用' }
  return map[type] || '其他'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

const fetchFees = async () => {
  try {
    const res = await axios.get('/property-fees', {
      params: { page: page.value, pageSize: pageSize.value }
    })
    if (res.code === 200) {
      fees.value = res.data.fees
      total.value = res.data.total
    }
  } catch (e) {
    ElMessage.error('获取账单列表失败')
  }
}

const generateFees = async () => {
  if (!generateForm.value.billing_cycle || generateForm.value.amount <= 0) {
    ElMessage.warning('请填写完整信息')
    return
  }
  generating.value = true
  try {
    const res = await axios.post('/property-fees/batch', generateForm.value)
    if (res.code === 200) {
      ElMessage.success(`成功为${res.data.count}位业主生成账单`)
      showGenerateDialog.value = false
      generateForm.value = { fee_type: 1, billing_cycle: '', amount: 0 }
      fetchFees()
    }
  } catch (e) {
    ElMessage.error('生成失败')
  } finally {
    generating.value = false
  }
}

const remindFee = async (id) => {
  try {
    await ElMessageBox.confirm('确认催缴此账单？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res = await axios.put(`/property-fees/${id}/remind`)
    if (res.code === 200) {
      ElMessage.success('催缴标记成功')
      fetchFees()
    }
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleSizeChange = (size) => {
  page.value = 1
  fetchFees()
}

const handleCurrentChange = (currentPage) => {
  fetchFees()
}

onMounted(() => {
  fetchFees()
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
}
</style>