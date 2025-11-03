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
