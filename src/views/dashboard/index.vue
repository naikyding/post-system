<script setup>
import DatePicker from '@/components/DatePicker.vue'
import MainChart from '@/components/chart/MainChart.vue'
import dayJs from 'dayjs'

import { useDashboard } from './useDashboard'
const {
  checkPaymentList,
  completedTotalAmount,
  pendingTotalAmount,
  cancelledTotalAmount,
  completedPayTypeTotalAmount,
  completedTotalOrder,
  completedTotalQuantity,

  searchDataByDatePicker,
  dataTable,
  dashboardStore,
  showPaymentList,
} = useDashboard()
</script>

<template>
  <div>
    <v-container fluid class="overflow-y-auto" :style="{ height: 'calc(100dvh - 48px)' }">
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
          <span class="text-display-small font-weight-bold">
            {{ completedTotalAmount }}
          </span>
        </v-col>

        <!-- 總交易金額 -->
        <v-col cols="12" class="py-0 text-body-small">
          總交易金額
          <span class="font-weight-bold text-success"> NT${{ completedTotalAmount }} </span>
        </v-col>

        <!-- 待處理金額 -->
        <v-col cols="12" class="py-0 text-body-small">
          待處理金額
          <span class="font-weight-bold text-warning"> NT${{ pendingTotalAmount }} </span>
        </v-col>

        <!-- 已取消金額 -->
        <v-col cols="12" class="py-0 text-body-small">
          已取消金額
          <span class="font-weight-bold text-error"> NT${{ cancelledTotalAmount }} </span>
        </v-col>

        <!-- 訂單數 -->
        <v-col cols="6">
          <v-card variant="tonal" rounded="lg" color="blue-darken-2" class="py-6">
            <v-card-item title="訂單數" class="pt-0" />
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-display-small" cols="12">
                  <span class="text-white font-weight-bold">
                    {{ completedTotalOrder }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 商品數 -->
        <v-col cols="6">
          <v-card variant="tonal" rounded="lg" color="deep-purple-darken-2" class="py-6">
            <v-card-item title="商品數" class="pt-0" />
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-display-small" cols="12">
                  <span class="text-white font-weight-bold">
                    {{ completedTotalQuantity }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 現金 -->
        <v-col
          v-for="completedItem in dashboardStore.dashboardData.total.completed"
          :key="completedItem.type"
          cols="12"
        >
          <v-card variant="tonal" rounded="lg" :color="completedItem.color" class="py-6">
            <v-card-title class="pt-0">
              <span class="mr-2">
                {{ completedItem.name }}
              </span>
              <v-btn
                @click="checkPaymentList(completedItem.type)"
                variant="outlined"
                rounded="xl"
                density="compact"
              >
                {{
                  dashboardStore.dashboardData.total.completed.find(
                    (item) => item.type === completedItem.type,
                  )?.orderQuantity || '--'
                }}
              </v-btn>
            </v-card-title>

            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-display-small" cols="12">
                  <span class="text-body-small text-white">NT$</span>
                  <span class="text-white font-weight-bold">
                    {{ completedPayTypeTotalAmount[completedItem.type] }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 客單價 -->
        <v-col cols="12">
          <v-card variant="tonal" rounded="lg" color="pink-darken-2" class="py-6">
            <v-card-item title="客單價" class="pt-0" />
            <v-card-text class="py-0">
              <v-row align="center" no-gutters>
                <v-col class="text-display-small" cols="12">
                  <span class="text-body-small text-white">NT$</span>
                  <span class="text-white font-weight-bold">
                    {{ Math.round(completedTotalAmount / completedTotalOrder) || 0 }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 項目列表 -->
        <v-col cols="12">
          <v-data-table
            :headers="dataTable.headers"
            :mobile="false"
            fixed-header
            hide-default-footer
            items-per-page="-1"
            :items="dataTable.list"
          ></v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
