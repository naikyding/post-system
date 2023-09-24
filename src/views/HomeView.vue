<script setup>
import { useSystemOrderList } from '../stores/orders'

import { useDashboardStore } from '../stores/dashboard'
import dayJs from 'dayjs'

import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayJs.extend(quarterOfYear)
import { dateFormat } from '../utils/day'
import { ref, onMounted, watchEffect, computed } from 'vue'

const SystemOrderListStore = useSystemOrderList()
const dashboardStore = useDashboardStore()

const completedTotalAmount = computed(() =>
  dashboardStore.dashboardData.total.completed.reduce((init, cur) => (init += cur.total), 0),
)

const pendingTotalAmount = computed(() =>
  dashboardStore.dashboardData.total.pending.reduce((init, cur) => (init += cur.total), 0),
)

const cancelledTotalAmount = computed(() =>
  dashboardStore.dashboardData.total.cancelled.reduce((init, cur) => (init += cur.total), 0),
)

const completedPayTypeTotalAmount = computed(() =>
  dashboardStore.dashboardData.total.completed.reduce(
    (init, cur) => {
      if (cur.type === 'cash') {
        init['cash'] = cur.total
      }
      if (cur.type === 'Line Pay') {
        init['linePay'] = cur.total
      }
      return init
    },
    { cash: 0, linePay: 0 },
  ),
)

const completedTotalOrder = computed(() =>
  dashboardStore.dashboardData.total.completed.reduce(
    (init, cur) => (init += cur.orderQuantity),
    0,
  ),
)

const completedTotalQuantity = computed(() =>
  dashboardStore.dashboardData.total.completed.reduce((init, cur) => (init += cur.itemQuantity), 0),
)

onMounted(() => {
  dashboardStore.getDashboardData(dashboardStore.formatSearchQueryString)
})

const date = ref()

function datePickerUpdate(changeDate) {
  console.log(`datePickerUpdate`)

  SystemOrderListStore.activeListDate.from = dateFormat(dayJs(changeDate[0]))
  SystemOrderListStore.activeListDate.to = dateFormat(dayJs(changeDate[1]))

  dashboardStore.searchData.from = dateFormat(dayJs(changeDate[0]))
  dashboardStore.searchData.to = dateFormat(dayJs(changeDate[1]))

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
      <v-row>
        <!-- 營業額 -->
        <v-col cols="12" class="pb-1 font-weight-bold">
          NT$
          <span class="text-h3 font-weight-bold">
            {{ completedTotalAmount }}
          </span>
        </v-col>

        <!-- 總交易金額 -->
        <v-col cols="12" class="py-0 text-caption">
          總交易金額
          <span class="font-weight-bold text-success"> NT${{ completedTotalAmount }} </span>
        </v-col>

        <!-- 待處理金額 -->
        <v-col cols="12" class="py-0 text-caption">
          待處理金額
          <span class="font-weight-bold text-warning"> NT${{ pendingTotalAmount }} </span>
        </v-col>

        <!-- 已取消金額 -->
        <v-col cols="12" class="py-0 text-caption">
          已取消金額
          <span class="font-weight-bold text-error"> NT${{ cancelledTotalAmount }} </span>
        </v-col>

        <!-- 訂單數 -->
        <v-col cols="6">
          <v-card variant="tonal" rounded="lg" color="success" class="py-6">
            <v-card-item title="訂單數" class="pt-0" />
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h3" cols="12">
                  <span class="text-white">
                    {{ completedTotalOrder }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 商品數 -->
        <v-col cols="6">
          <v-card variant="tonal" rounded="lg" color="success" class="py-6">
            <v-card-item title="商品數" class="pt-0" />
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h3" cols="12">
                  <span class="text-white">
                    {{ completedTotalQuantity }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 現金 -->
        <v-col cols="12">
          <v-card variant="tonal" rounded="lg" color="success" class="py-6">
            <v-card-item title="現金" class="pt-0" />
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h3" cols="12">
                  <span class="text-caption text-white">NT$</span>
                  <span class="text-white">
                    {{ completedPayTypeTotalAmount.cash }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- LinePay 支付 -->
        <v-col cols="12">
          <v-card variant="tonal" rounded="lg" color="success" class="py-6">
            <v-card-item title="Line Pay" class="pt-0" />
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h3" cols="12">
                  <span class="text-caption text-white">NT$</span>
                  <span class="text-white">
                    {{ completedPayTypeTotalAmount.linePay }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 客單價 -->
        <v-col cols="12">
          <v-card variant="tonal" rounded="lg" color="success" class="py-6">
            <v-card-item title="客單價" class="pt-0" />
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-h3" cols="12">
                  <span class="text-caption text-white">NT$</span>
                  <span class="text-white">
                    {{ completedTotalAmount / completedTotalOrder }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
