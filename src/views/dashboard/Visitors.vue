<!-- 來客數 -->
<script setup>
import { useSystemOrderList } from '@/stores/orders'

const SystemOrderListStore = useSystemOrderList()
</script>

<template>
  <v-card variant="tonal" rounded="xl" class="py-6">
    <v-card-item title="來客數" class="pt-0" />
    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col class="text-h2" cols="12">
          <span class="text-primary">
            {{ SystemOrderListStore.dashboardDataStep1.visitors }}
          </span>
          <span class="text-caption">人</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>
