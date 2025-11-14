<script setup>
import { useMarkersStore } from '@/stores/products'
import { inject, ref } from 'vue'
import { useTable } from './useTable'
import DotsActionMenu from '@/components/DotsActionMenu.vue'

const { getRoles, headers } = useTable()
const markersStore = useMarkersStore()
const search = ref('')
const markers = inject('markers')

const menuItems = [
  {
    title: '修改標籤',
    icon: 'mdi-pencil',
    code: 'update',
    event: ({ model, itemData }) =>
      markers.openFormDialog({ model, id: itemData._id, data: itemData }),
  },
  { type: 'divider' },
  {
    title: '刪除標籤',
    icon: 'mdi-delete',
    code: 'delete',
    event: ({ model, itemData }) =>
      markers.openConfirmDialog({ model, id: itemData._id, data: itemData }),
  },
]
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
          <DotsActionMenu :items="menuItems" :data="item" :id="item._id" />
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
