<script setup>
import DataTable from './components/DataTable.vue'
import { useSystemOrderList } from '../../stores/orders'

const systemOrderStore = useSystemOrderList()
</script>

<template>
  <v-tabs
    fixed-tabs
    v-model="systemOrderStore.activeListTab"
    color="primary"
    bg-color="white"
    class="rounded-t-lg"
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
</template>

<style lang="scss" scoped></style>
