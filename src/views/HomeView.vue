<script setup>
import { useSystemOrderList } from '../stores/orders'
import { useDashboardStore } from '../stores/dashboard'
import dayJs from 'dayjs'

import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayJs.extend(quarterOfYear)
import { dateFormat } from '../utils/day'
import { ref, onMounted, watchEffect, computed, reactive } from 'vue'

import DatePicker from '../components/DatePicker.vue'

const dashboardStore = useDashboardStore()

const datePicker = reactive({
  dialog: false,
})

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
</script>

<template>
  <div class="h-screen overflow-x-hidden overflow-y-auto">
    <v-container fluid>
      <v-row>
        <v-col>
          <!-- 日期選擇器 -->
          <DatePicker :is-range="true" />
        </v-col>
      </v-row>
      <v-row class="px-3 mt-3">
        <!-- 日期選擇器 -->
        <v-bottom-sheet v-model="datePicker.dialog">
          <template v-slot:activator="{ props }">
            <span class="mr-2">
              {{ dashboardStore.searchData.from + ' / ' + dashboardStore.searchData.to }}</span
            >
            <v-btn v-bind="props" variant="outlined" size="medium" icon="mdi-chevron-down"></v-btn>
          </template>

          <v-card class="text-center">
            <v-date-picker
              v-model="dateModel"
              min-width="100vw"
              @click:cancel="datePickerCancel"
              @click:save="datePickerCancel"
              @update:modelValue="updateDateModel"
              multiple
            />
          </v-card>
        </v-bottom-sheet>
      </v-row>

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
            <v-card-item
              :title="`現金 (${
                dashboardStore.dashboardData.total.completed.find((item) => item.type === 'cash')
                  ?.orderQuantity || '--'
              })`"
              class="pt-0"
            />
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
            <v-card-item
              :title="`Line Pay (${
                dashboardStore.dashboardData.total.completed.find(
                  (item) => item.type === 'Line Pay',
                )?.orderQuantity || '--'
              })`"
              class="pt-0"
            />
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
