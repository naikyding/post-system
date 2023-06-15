<script setup>
import { ref } from 'vue'
import DataTable from './components/DataTable.vue'

const tab = ref('three')
</script>

<template>
  <v-tabs v-model="tab" bg-color="primary">
    <v-tab value="three">待處理</v-tab>
    <v-tab value="four">已完成</v-tab>
    <v-tab value="two">未付款</v-tab>
    <v-tab value="one">全部</v-tab>
    <v-tab value="five">取消</v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item value="three">待處理</v-window-item>
    <v-window-item value="four">已完成</v-window-item>
    <v-window-item value="two">未付款</v-window-item>
    <v-window-item value="one">
      <DataTable />
    </v-window-item>
    <v-window-item value="five">取消</v-window-item>
  </v-window>
</template>

<style lang="scss" scoped></style>
