<script setup>
import { useSystemOrderList } from '../stores/orders'

const SystemOrderListStore = useSystemOrderList()
</script>

<template>
  <div class="h-screen pa-4">
    <div class="d-sm-flex justify-space-between">
      <h3>Dashboard</h3>
      <div>
        <v-btn
          v-for="(date, index) in SystemOrderListStore.selectDate"
          :key="date + index"
          density="compact"
        >
          {{ date.name }}
        </v-btn>
      </div>
    </div>
    <v-container>
      <v-row>
        <v-col cols="6" sm="3">營業額</v-col>
        <v-col cols="6" sm="3">來客數</v-col>
        <v-col cols="6" sm="3">客單價</v-col>
        <v-col cols="6" sm="3">--</v-col>
      </v-row>
    </v-container>
  </div>
</template>
