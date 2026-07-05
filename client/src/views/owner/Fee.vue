<template>
  <div class="page-container">
    <div class="page-header">
      <h2>费用管理</h2>
      <el-select v-model="status" placeholder="状态筛选" style="width: 140px;" @change="handleStatusChange">
        <el-option label="全部" :value="-1" />
        <el-option label="待缴费" :value="0" />
        <el-option label="已缴费" :value="1" />
      </el-select>
    </div>
    <el-table :data="fees" border class="fee-table">
      <el-table-column prop="fee_type" label="费用类型" min-width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ getFeeTypeText(row.fee_type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" min-width="120">
        <template #default="{ row }">
          <span class="amount">¥{{ (Number(row.amount) || 0).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billing_cycle" label="计费周期" min-width="130">
        <template #default="{ row }">
          {{ formatBillingCycle(row.billing_cycle) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="160">
        <template #default="{ row }">
          <div class="status-tags">
            <el-tag :type="row.status === 0 ? 'warning' : 'success'" size="small">
              {{ row.status === 0 ? '待缴费' : '已缴费' }}
            </el-tag>
            <el-tag v-if="row.is_remind === 1 && row.status === 0" type="danger" size="small" class="remind-tag">已催缴</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pay_time" label="缴费时间" min-width="180">
        <template #default="{ row }">
          {{ row.pay_time ? formatTime(row.pay_time) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            plain
            :disabled="row.status !== 0"
            @click="handlePay(row)"
          >{{ row.status === 0 ? '缴费' : '已缴费' }}</el-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/request'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const fees = ref([])
const status = ref(-1)

const fetchFees = async () => {
  const params = { page: page.value, pageSize: pageSize.value }
  if (status.value !== -1) {
    params.status = status.value
  }
  const res = await axios.get('/property-fees/owner', { params })
  fees.value = res.data.fees
  total.value = res.data.total
}

const handlePageChange = (val) => {
  fetchFees()
}

const handleStatusChange = (val) => {
  page.value = 1
  fetchFees()
}

const handlePay = async (row) => {
  await axios.put(`/property-fees/${row.id}/pay`)
  fetchFees()
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

const getFeeTypeText = (type) => {
  const map = { 1: '物业费', 2: '水电费', 3: '停车费', 4: '其他费用' }
  return map[type] || '其他费用'
}

const formatBillingCycle = (cycle) => {
  if (!cycle) return '-'
  if (cycle.includes('年')) return cycle
  const m = cycle.match(/^(\d{4})-(\d{1,2})$/)
  if (m) return `${m[1]}年${Number(m[2])}月`
  return cycle
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

.fee-table {
  width: 100%;
}

.amount {
  font-weight: bold;
  color: #e74c3c;
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.remind-tag {
  margin-left: 0;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
