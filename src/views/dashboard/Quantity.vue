<!-- 來客數 -->
<script setup>
import { useSystemOrderList } from '@/stores/orders'

const SystemOrderListStore = useSystemOrderList()
</script>

<template>
  <v-card variant="tonal">
    <v-card-item title="數量"> </v-card-item>
    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col class="text-h2" cols="12">
          <span class="text-primary">
            {{ SystemOrderListStore.dashboardDataStep1.quantity }}
          </span>
          <span class="text-caption">片</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>
