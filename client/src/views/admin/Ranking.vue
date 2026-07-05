<template>
  <div class="page-container">
    <div class="page-header">
      <h2>工人排名</h2>
    </div>
    <el-table :data="rankings" border class="ranking-table">
      <el-table-column prop="rank" label="排名" width="110" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.rank === 1" type="danger" size="large">第{{ row.rank }}名</el-tag>
          <el-tag v-else-if="row.rank === 2" type="warning" size="large">第{{ row.rank }}名</el-tag>
          <el-tag v-else-if="row.rank === 3" type="success" size="large">第{{ row.rank }}名</el-tag>
          <span v-else>第{{ row.rank }}名</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="工人姓名" width="180" />
      <el-table-column prop="skill" label="技能特长" width="200" />
      <el-table-column prop="completed_orders" label="完工量" width="140" align="center">
        <template #default="{ row }">
          <span class="number">{{ row.completed_orders }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="avg_rating" label="平均分" width="140" align="center">
        <template #default="{ row }">
          <span class="number">{{ row.avg_rating > 5 ? (row.avg_rating / 2).toFixed(1) : row.avg_rating }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="总分" width="140" align="center">
        <template #default="{ row }">
          <span class="score">{{ row.score }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/request'

const rankings = ref([])

const fetchRankings = async () => {
  const res = await axios.get('/dashboard/ranking')
  rankings.value = res.data
}

onMounted(() => {
  fetchRankings()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.ranking-table {
  width: 100%;
}

.number {
  font-weight: bold;
  color: #333;
}

.score {
  font-weight: bold;
  color: #e74c3c;
  font-size: 16px;
}
</style>
