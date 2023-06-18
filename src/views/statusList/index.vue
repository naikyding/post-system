<script setup>
import DataTable from './components/DataTable.vue'
import { useSystemOrderList } from '../../stores/orders'
import dayJS from 'dayjs'

const systemOrderStore = useSystemOrderList()
const now = dayJS(new Date()).format('YYYY-MM-DD')
systemOrderStore.activeListDate.from = now
systemOrderStore.activeListDate.to = now
systemOrderStore.getOrderList()
</script>

<template>
  <v-tabs v-model="systemOrderStore.activeListTab" bg-color="primary">
    <v-tab value="pending">待處理</v-tab>
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
</template>

<style lang="scss" scoped></style>
