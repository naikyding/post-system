<script setup>
import LineChart from '@/components/chart/LineChart.vue'
import DoughnutChart from '@/components/chart/DoughnutChart.vue'
import { useSystemOrderList } from '../../stores/orders'
import { useDashboardStore } from '../../stores/dashboard'
import { onMounted, ref } from 'vue'
import { watchEffect } from 'vue'
import { watch } from 'vue'

const systemOrderStore = useSystemOrderList()
const dashboardStore = useDashboardStore()

const searchData = ref({
  // from: dashboardStore.searchData.from,
  // to: dashboardStore.searchData.to,
  status: 'completed',
  agent: localStorage.getItem('agentsId'),
})

watchEffect(() => {
  console.log('watchEffect', dashboardStore.searchData.from)
  searchData.value.from = dashboardStore.searchData.from
  searchData.value.to = dashboardStore.searchData.to
  searchOrderList(searchData.value)
})

const data = ref([])

onMounted(() => {
  // searchOrderList(searchData.value)
})

async function searchOrderList(filterSearch) {
  console.log('searchOrderList', filterSearch)
  const res = await systemOrderStore.pureGetOrderList(filterSearch)
  console.log('res', res)
  data.value = res.items
}
</script>

<template>
  <div>
    <LineChart :data="data" />
    <DoughnutChart :data="data" />
  </div>
</template>

<style lang="scss" scoped></style>
