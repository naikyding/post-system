<script setup>
import { inject, ref } from 'vue'
import DotsActionMenu from '@/components/DotsActionMenu.vue'

const search = ref('')
const props = defineProps({
  headers: {
    default: [],
  },
  items: {
    default: [],
  },
})

const agent = inject('agent')

// MENU
const menuItems = [
  { title: '新增用戶', icon: 'mdi-plus-circle', code: 'createUser', event: menuItemEvent },
  { type: 'divider' },
  { title: '修改商家', icon: 'mdi-pencil', code: 'editAgent', event: menuItemEvent },
  { type: 'divider' },
  { title: '刪除商家', icon: 'mdi-trash-can', code: 'deleteAgent', event: menuItemEvent },
]

function menuItemEvent({ model, itemData }) {
  const id = itemData._id
  const item = itemData
  agent.openDialog({ model, id, item })
}
</script>

<template>
  <div class="px-4 pb-4">
    <v-text-field
      v-model="search"
      class="mb-4"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      single-line
    ></v-text-field>

    <v-btn @click="agent.openDialog({ model: 'createAgent' })" block color="success">
      <v-icon size="30">mdi-plus</v-icon>
    </v-btn>

    <v-data-table
      :headers="props.headers"
      :items="props.items"
      :search="search"
      density="compact"
      fixed-header
      hide-default-footer
      :items-per-page="-1"
      hover
    >
      <template v-slot:item.image="{ value }">
        <div class="pa-1">
          <v-avatar color="grey" size="32" :image="value"></v-avatar>
        </div>
      </template>
      <template v-slot:item._id="{ value }">
        <v-chip
          @click="agent.handelCopyId(value)"
          variant="tonal"
          size="x-small"
          color="cyan"
          append-icon="mdi-content-copy"
        >
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:item.name="{ value }">
        {{ value }}
      </template>
      <template v-slot:item.description="{ value }">
        {{ value }}
      </template>

      <template v-slot:item.actions="{ item }">
        <DotsActionMenu :items="menuItems" :data="item" :id="item._id" />
      </template>
    </v-data-table>
  </div>
</template>
