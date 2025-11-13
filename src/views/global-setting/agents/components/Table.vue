<script setup>
import { inject, ref } from 'vue'

const search = ref('')
const props = defineProps({
  headers: {
    default: [],
  },
  items: {
    default: [],
  },
})

// MENU
const menuItems = [
  { title: '新增用戶', icon: 'mdi-plus-circle', code: 'createUser' },
  { type: 'divider' },
  { title: '修改商家', icon: 'mdi-pencil', code: 'editAgent' },
  { type: 'divider' },
  { title: '刪除商家', icon: 'mdi-trash-can', code: 'deleteAgent' },
]

const agent = inject('agent')
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
        <div>
          <v-btn
            icon="mdi-dots-vertical"
            size="x-small"
            variant="outlined"
            :id="`menu-activator${item._id}`"
          >
          </v-btn>
          <v-menu :activator="`#menu-activator${item._id}`">
            <v-list class="py-0" density="compact" slim>
              <template v-for="menuItem in menuItems" :key="menuItem.type">
                <v-divider v-if="menuItem.type === 'divider'" />
                <v-list-item
                  v-else
                  @click="agent.openDialog({ model: menuItem.code, id: item._id, item })"
                >
                  <v-list-item-title>
                    <span class="text-subtitle-2">{{ menuItem.title }} </span>
                  </v-list-item-title>
                  <template v-slot:prepend>
                    <v-icon size="small" :icon="menuItem.icon"></v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
