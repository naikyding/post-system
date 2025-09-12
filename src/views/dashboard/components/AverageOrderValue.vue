<!-- 客單價 -->
<script setup>
import { useSystemOrderList } from '@/stores/orders'

const SystemOrderListStore = useSystemOrderList()
</script>

<template>
  <v-card variant="tonal" rounded="xl" class="py-6">
    <v-card-item title="客單價" class="pt-0" />
    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col class="text-h2" cols="12">
          <span class="text-primary">
            {{ Math.round(SystemOrderListStore.dashboardDataStep1.averageOrderValue) || '--' }}
          </span>
          <span class="text-caption">元</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>
