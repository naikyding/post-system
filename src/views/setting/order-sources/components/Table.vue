<script setup>
import { useOrderSourcesStore } from '@/stores/orderSources'
import { inject, ref } from 'vue'
import { useTable } from './useTable'
import DotsActionMenu from '@/components/DotsActionMenu.vue'

const { getRoles, headers } = useTable()
const orderSourcesStore = useOrderSourcesStore()
const search = ref('')
const orderSources = inject('orderSources')

const menuItems = [
  {
    title: '修改標籤',
    icon: 'mdi-pencil',
    code: 'update',
    event: ({ model, itemData }) =>
      orderSources.openFormDialog({ model, id: itemData._id, data: itemData }),
  },
  { type: 'divider' },
  {
    title: '刪除標籤',
    icon: 'mdi-delete',
    code: 'delete',
    event: ({ model, itemData }) =>
      orderSources.openConfirmDialog({ model, id: itemData._id, data: itemData }),
  },
]
const status = {
  active: {
    name: '啟用',
    color: 'success',
  },
  inactive: {
    name: '停用',
    color: 'error',
  },
}
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

      <v-btn block color="success" @click="orderSources.openFormDialog({ model: 'create' })">
        <v-icon size="30">mdi-plus</v-icon>
      </v-btn>
    </div>

    <v-expand-transition class="content-height">
      <v-data-table
        :headers="headers"
        :items="orderSourcesStore.orderSourceList"
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
        <template v-slot:item.status="{ value }">
          <v-chip :color="status[value]?.color" text-color="white" size="small" class="ma-0">
            {{ status[value]?.name }}
          </v-chip>
        </template>

        <template #item.isDefault="{ item }">
          <v-icon v-if="item.isDefault" color="warning"> mdi-star </v-icon>
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
