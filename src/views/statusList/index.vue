<script setup>
import DataTable from './components/DataTable.vue'
import { useSystemOrderList } from '../../stores/orders'
import DatePicker from '@/components/DatePicker.vue'

const systemOrderStore = useSystemOrderList()

systemOrderStore.getOrderList('today')
</script>

<template>
  <div class="ma-4">
    <DatePicker />
    <v-tabs
      fixed-tabs
      v-model="systemOrderStore.activeListTab"
      color="primary"
      class="rounded-t-lg mt-2"
    >
      <v-tab value="pending"
        >待處理
        <span class="text-error" v-show="systemOrderStore.pendingQuantity > 0"
          >({{ systemOrderStore.pendingQuantity }})</span
        >
      </v-tab>
      <v-tab value="completed">已完成</v-tab>
      <v-tab :value="false">未付款</v-tab>
      <v-tab value="all">全部</v-tab>
      <v-tab value="cancelled">取消</v-tab>
    </v-tabs>

    <v-window v-model="systemOrderStore.activeListTab">
      <!-- 待處理 -->
      <v-window-item value="pending">
        <DataTable />
      </v-window-item>

      <!-- 已完成 -->
      <v-window-item value="completed">
        <DataTable />
      </v-window-item>

      <!-- 未付款 -->
      <v-window-item :value="false">
        <DataTable />
      </v-window-item>

      <!-- 全部 -->
      <v-window-item value="all">
        <DataTable />
      </v-window-item>

      <!-- 取消 -->
      <v-window-item value="cancelled">
        <DataTable />
      </v-window-item>
    </v-window>
  </div>
</template>

<style lang="scss" scoped></style>
