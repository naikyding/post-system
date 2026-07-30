<script setup>
import { usePaymentTypesStore } from '@/stores/paymentType'
import { inject, ref } from 'vue'
import { useTable } from './useTable'
import DotsActionMenu from '@/components/DotsActionMenu.vue'

const { getRoles, headers } = useTable()
const paymentTypesStore = usePaymentTypesStore()
const search = ref('')
const paymentTypes = inject('paymentTypes')

const menuItems = [
  {
    title: '修改',
    icon: 'mdi-pencil',
    code: 'update',
    event: ({ model, itemData }) =>
      paymentTypes.openFormDialog({ model, id: itemData._id, data: itemData }),
  },
  { type: 'divider' },
  {
    title: '刪除',
    icon: 'mdi-delete',
    code: 'delete',
    event: ({ model, itemData }) =>
      paymentTypes.openConfirmDialog({ model, id: itemData._id, data: itemData }),
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

      <v-btn block color="success" @click="paymentTypes.openFormDialog({ model: 'create' })">
        <v-icon size="30">mdi-plus</v-icon>
      </v-btn>
    </div>

    <v-expand-transition class="content-height">
      <v-data-table
        :headers="headers"
        :items="paymentTypesStore.list"
        :search="search"
        density="compact"
        fixed-header
        hide-default-footer
        :items-per-page="-1"
        hover
      >
        <template #item.name="{ item }">
          <div class="d-flex align-center ga-2">
            <span
              class="d-inline-block rounded-circle"
              :style="{
                backgroundColor: item.color,
                width: '16px',
                height: '16px',
              }"
            />

            <span class="font-weight-bold">
              {{ item.name }}
            </span>

            <v-chip size="x-small" variant="outlined" color="grey">
              {{ item.code }}
            </v-chip>
          </div>
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
