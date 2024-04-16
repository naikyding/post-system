<script setup>
import { useSystemOrderList } from '../stores/orders'
import { useDashboardStore } from '../stores/dashboard'
import dayJs from 'dayjs'
import MainChart from '../components/chart/MainChart.vue'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayJs.extend(quarterOfYear)
import { dateFormat } from '../utils/day'
import { ref, onMounted, watchEffect, computed, reactive, watch } from 'vue'

import DatePicker from '@/components/DatePicker.vue'

const dashboardStore = useDashboardStore()

const datePicker = reactive({
  dialog: false,
})

const showPaymentList = ref({
  type: null,
  sheet: false,
  list: computed(() => {
    // 由新到舊排序
    return (
      dashboardStore.dashboardData.total.completed
        .find((item) => item.type === showPaymentList.value.type)
        ?.data.sort((a, b) => dayJs(b.createdAt) - dayJs(a.createdAt)) || []
    )
  }),
})

function checkPaymentList(type) {
  showPaymentList.value.type = type
  showPaymentList.value.sheet = true
}

watch(
  () => showPaymentList.value.sheet,
  (status) => {
    if (status) return false

    showPaymentList.value.type = null
  },
)

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

function datePickerCancel() {
  datePicker.dialog = false
}

const dateModel = ref(null)

function watchDatePicker() {
  console.log('watchDatePicker')
}

async function updateDateModel(date) {
  console.log('updateDateModel')
  await date.forEach((item, index, array) => {
    if (index === 0) dashboardStore.searchData.from = dateFormat(item)
    if (index === 0 && array.length < 2) dashboardStore.searchData.to = dateFormat(item)
    if (index === 1) dashboardStore.searchData.to = dateFormat(item)
  })
  dashboardStore.getDashboardData(dashboardStore.formatSearchQueryString)
}

function searchDataByDatePicker(searchDate) {
  dashboardStore.searchData.from = searchDate.start
  dashboardStore.searchData.to = searchDate.end

  dashboardStore.getDashboardData(dashboardStore.formatSearchQueryString)
}
</script>

<template>
  <div class="h-screen overflow-x-hidden overflow-y-auto">
    <v-container fluid>
      <v-row>
        <v-col>
          <!-- 日期選擇器 -->
          <DatePicker
            :active-date="dashboardStore.searchData"
            :is-range="true"
            @search-list="searchDataByDatePicker"
          />
        </v-col>
      </v-row>

      <MainChart />

      <v-row>
        <!-- 營業額 -->
        <v-col cols="12" class="py-2 font-weight-bold">
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
            <v-card-title class="pt-0">
              <span class="mr-2">
                {{ `現金` }}
              </span>
              <v-btn
                @click="checkPaymentList('cash')"
                variant="outlined"
                rounded="xl"
                density="compact"
              >
                {{
                  dashboardStore.dashboardData.total.completed.find((item) => item.type === 'cash')
                    ?.orderQuantity || '--'
                }}
              </v-btn>
            </v-card-title>

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
            <v-card-title class="pt-0">
              <span class="mr-2">
                {{ `Line Pay` }}
              </span>
              <v-btn
                @click="checkPaymentList('Line Pay')"
                variant="outlined"
                rounded="xl"
                density="compact"
              >
                {{
                  dashboardStore.dashboardData.total.completed.find(
                    (item) => item.type === 'Line Pay',
                  )?.orderQuantity || '--'
                }}
              </v-btn>
            </v-card-title>
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

          <!-- 支付清單 -->
          <v-bottom-sheet v-model="showPaymentList.sheet">
            <v-card :title="`${showPaymentList.type} 支付清單`">
              <v-list lines="two" select-strategy="classic">
                <v-list-item
                  v-for="item in showPaymentList.list"
                  :key="item.createdAt"
                  :value="item.createdAt"
                >
                  <!-- 勾選 -->
                  <template v-slot:prepend="{ isActive }">
                    <v-list-item-action start>
                      <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                    </v-list-item-action>
                  </template>

                  <!-- 未三碼 -->
                  <v-list-item-title>
                    <h3>{{ item.mobile }}</h3>
                  </v-list-item-title>

                  <!-- 時間 -->
                  <v-list-item-subtitle>
                    {{ dayJs(item.createdAt).format('YYYY-MM-DD HH:mm') }}
                  </v-list-item-subtitle>

                  <!-- 金額 -->
                  <template v-slot:append>
                    <h3>NT$ {{ item.total }}</h3>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-bottom-sheet>
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
                    {{ Math.round(completedTotalAmount / completedTotalOrder) || 0 }}
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
