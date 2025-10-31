<script setup>
import { useMarkersStore } from '@/stores/products'
import { inject, ref } from 'vue'
import { useTable } from './useTable'

const { getRoles, headers } = useTable()
const markersStore = useMarkersStore()
const search = ref('')
const markers = inject('markers')
</script>

<template>
  <div class="d-flex flex-column" :style="{ height: 'calc(100dvh - 48px - 65px)' }">
    <div>
      <v-text-field
        v-model="search"
        class="mb-4"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>

      <v-btn block color="success" @click="markers.openFormDialog({ model: 'create' })">
        <v-icon size="30">mdi-plus</v-icon>
      </v-btn>
    </div>

    <v-expand-transition class="content-height">
      <v-data-table
        :headers="headers"
        :items="markersStore.markerList"
        :search="search"
        density="compact"
        fixed-header
        hide-default-footer
        :items-per-page="-1"
        hover
      >
        <template v-slot:item.name="{ value }">
          <span class="font-weight-black">{{ value }}</span>
        </template>
        <template v-slot:item.description="{ value }">
          <span class="font-weight-black">{{ value }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <!-- 修改 -->
          <v-btn
            icon="mdi-pencil"
            size="40"
            variant="plain"
            color="warning"
            @click="markers.openFormDialog({ model: 'update', id: item._id, data: item })"
          ></v-btn>
          <!-- 刪除 -->
          <v-btn
            @click="markers.openConfirmDialog({ model: 'delete', id: item._id, data: item })"
            icon="mdi-delete"
            size="40"
            variant="plain"
            color="error"
          ></v-btn>
        </template>
      </v-data-table>
    </v-expand-transition>
  </div>
</template>

<style scoped>
.content-height {
  flex: 1; /* 撐滿剩餘空間 */
  overflow: auto; /* 可捲動 */
  min-height: 0; /* 避免 flex 捲軸失效 */
}
</style>
