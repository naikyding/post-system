<script setup>
import { useSystemOrderList } from '../stores/orders'
import AverageOrderValue from './dashboard/AverageOrderValue.vue'
import Revenue from './dashboard/Revenue.vue'
import Visitors from './dashboard/Visitors.vue'
import dayJs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
dayJs.extend(quarterOfYear)
import { dateFormat } from '../utils/day'
import { nextTick, onMounted } from 'vue'

const SystemOrderListStore = useSystemOrderList()

onMounted(() => {
  nextTick(() => {
    SystemOrderListStore.getOrderListFromSystem(SystemOrderListStore.activeListDate)
  })
})

function changeSearchData(type) {
  if (SystemOrderListStore.activeRange === type) return false
  SystemOrderListStore.activeRange = type
  SystemOrderListStore.activeListDate.from = dateFormat(
    dayJs().subtract(type === 'day' ? 0 : 1, type),
  )

  SystemOrderListStore.getOrderListFromSystem(SystemOrderListStore.activeListDate)
}
</script>

<template>
  <div class="h-screen pa-4">
    <div class="d-sm-flex justify-space-between">
      <h3>Dashboard</h3>
      <div>
        <v-btn
          v-for="(date, index) in SystemOrderListStore.selectDate"
          :key="date + index"
          density="compact"
          :active="date.range === SystemOrderListStore.activeRange"
          @click="changeSearchData(date.range)"
        >
          {{ date.name }}
        </v-btn>
      </div>
    </div>
    <v-container fluid class="mt-4">
      <v-row>
        <v-col cols="12" sm="6" md="3" class="pa-1">
          <!-- 營業額 -->
          <Revenue />
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pa-1">
          <!-- 來客數 -->
          <Visitors />
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pa-1">
          <!-- 客單價 -->
          <AverageOrderValue />
        </v-col>
        <v-col cols="12" sm="6" md="3" class="pa-1">
          <AverageOrderValue />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
