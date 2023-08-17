<script setup>
import { useSystemOrderList } from '../stores/orders'
import AverageOrderValue from './dashboard/AverageOrderValue.vue'
import Revenue from './dashboard/Revenue.vue'
import Visitors from './dashboard/Visitors.vue'
import Quantity from './dashboard/Quantity.vue'
import TopProduct from './dashboard/TopProduct.vue'

import dayJs from 'dayjs'

import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayJs.extend(quarterOfYear)
import { dateFormat } from '../utils/day'
import { ref, nextTick, onMounted, watchEffect } from 'vue'

const SystemOrderListStore = useSystemOrderList()

onMounted(() => {
  nextTick(() => {
    SystemOrderListStore.getOrderListFromSystem(SystemOrderListStore.activeListDate)
  })
})

const date = ref()

function datePickerUpdate(changeDate) {
  console.log(`datePickerUpdate`)

  SystemOrderListStore.activeListDate.from = dateFormat(dayJs(changeDate[0]))
  SystemOrderListStore.activeListDate.to = dateFormat(dayJs(changeDate[1]))

  SystemOrderListStore.getOrderListFromSystem(SystemOrderListStore.activeListDate)
}

watchEffect(() => {
  date.value = [SystemOrderListStore.activeListDate.from, SystemOrderListStore.activeListDate.to]
})

function changeSearchData(type) {
  if (type === 'yesterday') {
    const yesterday = dateFormat(dayJs().add(-1, 'day'))
    SystemOrderListStore.activeListDate.from = yesterday
    SystemOrderListStore.activeListDate.to = yesterday
  } else {
    SystemOrderListStore.activeListDate.from = dateFormat(
      dayJs().subtract(type === 'day' ? 0 : 1, type),
    )
  }

  SystemOrderListStore.getOrderListFromSystem(SystemOrderListStore.activeListDate)
}
</script>

<template>
  <div class="h-screen overflow-x-hidden overflow-y-auto">
    <v-container fluid class="mt-2">
      <v-row>
        <v-col sm="12" md="6" class="d-flex align-center"> <h3>Dashboard</h3></v-col>
        <v-col sm="12" md="6">
          <div class="text-right">
            <v-btn-toggle
              divided
              v-model="SystemOrderListStore.activeRange"
              rounded
              variant="outlined"
              color="primary"
              group
            >
              <v-btn
                v-for="(date, index) in SystemOrderListStore.selectDate"
                :key="date + index"
                :value="date.range"
                @click="changeSearchData(date.range)"
              >
                {{ date.name }}</v-btn
              >
              <v-btn icon="mdi-calendar-range" value="customDate"></v-btn>
            </v-btn-toggle>

            <VueDatePicker
              v-show="SystemOrderListStore.activeRange === 'customDate'"
              class="mt-4"
              v-model="date"
              range
              multi-calendars-solo
              @update:model-value="datePickerUpdate"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="mt-2">
      <v-row class="px-2">
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
          <Quantity />
        </v-col>

        <!-- Chart -->
        <v-col cols="12" class="px-0">
          <TopProduct />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
