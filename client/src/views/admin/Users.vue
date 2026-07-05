<template>
  <div class="page-container">
    <div class="page-header">
      <h2>用户管理</h2>
      <div class="header-actions">
        <el-select v-model="role" placeholder="角色筛选" style="width: 120px" @change="handleRoleChange">
          <el-option label="全部" :value="-1" />
          <el-option label="业主" :value="0" />
          <el-option label="工人" :value="2" />
        </el-select>
        <el-button type="primary" @click="showAddDialog">新增用户</el-button>
      </div>
    </div>
    <el-table :data="users" border class="user-table">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 0 ? 'info' : 'success'">
            {{ row.role === 0 ? '业主' : '工人' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="building" label="楼栋" width="100" />
      <el-table-column prop="unit" label="单元" width="80" />
      <el-table-column prop="room" label="房间号" width="100" />
      <el-table-column prop="skill" label="技能" width="120" />
      <el-table-column prop="create_time" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
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
    <el-dialog v-model="addVisible" title="新增用户" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="80px">
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option label="业主" :value="0" />
            <el-option label="工人" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone" />
        </el-form-item>
        <el-form-item v-if="addForm.role === 0" label="楼栋" prop="building">
          <el-input v-model="addForm.building" />
        </el-form-item>
        <el-form-item v-if="addForm.role === 0" label="单元" prop="unit">
          <el-input v-model="addForm.unit" />
        </el-form-item>
        <el-form-item v-if="addForm.role === 0" label="房间号" prop="room">
          <el-input v-model="addForm.room" />
        </el-form-item>
        <el-form-item v-if="addForm.role === 2" label="技能" prop="skill">
          <el-input v-model="addForm.skill" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleAdd">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from '@/utils/request'

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const users = ref([])
const role = ref(-1)
const addVisible = ref(false)
const loading = ref(false)
const addFormRef = ref(null)

const addForm = reactive({
  role: 0,
  username: '',
  password: '',
  name: '',
  phone: '',
  building: '',
  unit: '',
  room: '',
  skill: ''
})

const addRules = {
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  building: [{ required: addForm.role === 0, message: '请输入楼栋', trigger: 'blur' }],
  unit: [{ required: addForm.role === 0, message: '请输入单元', trigger: 'blur' }],
  room: [{ required: addForm.role === 0, message: '请输入房间号', trigger: 'blur' }],
  skill: [{ required: addForm.role === 2, message: '请输入技能', trigger: 'blur' }]
}

const fetchUsers = async () => {
  const params = { page: page.value, pageSize: pageSize.value }
  if (role.value !== -1) {
    params.role = role.value
  }
  const res = await axios.get('/users', { params })
  users.value = res.data.users
  total.value = res.data.total
}

const handlePageChange = (val) => {
  fetchUsers()
}

const handleRoleChange = () => {
  page.value = 1
  fetchUsers()
}

const showAddDialog = () => {
  addForm.role = 0
  addForm.username = ''
  addForm.password = ''
  addForm.name = ''
  addForm.phone = ''
  addForm.building = ''
  addForm.unit = ''
  addForm.room = ''
  addForm.skill = ''
  addVisible.value = true
}

const handleAdd = async () => {
  const valid = await addFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await axios.post('/users', addForm)
    addVisible.value = false
    fetchUsers()
  } finally {
    loading.value = false
  }
}

const handleDelete = (row) => {
  axios.delete(`/users/${row.id}`).then(() => {
    fetchUsers()
  })
}

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchUsers()
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

.header-actions {
  display: flex;
  gap: 10px;
}

.user-table {
  width: 100%;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
