<script setup>
import { useRolesStore } from '@/stores/roles'
import { inject, ref } from 'vue'
import DotsActionMenu from '@/components/DotsActionMenu.vue'

const rolesStore = useRolesStore()
const search = ref('')
const headers = [
  { title: '角色名稱', key: 'name' },
  { title: '代碼', key: 'code' },
  { title: '狀態', key: 'status', align: 'center' },
  { title: '操作', key: 'actions', align: 'center' },
]

const role = inject('role')

const menuItems = [
  {
    title: '選單管理',
    icon: 'mdi-sitemap',
    code: 'menus',
    event: ({ model, itemData }) => role.openMenuAndOperationDrawer({ model, roleItem: itemData }),
  },
  { type: 'divider' },
  {
    title: '修改角色',
    icon: 'mdi-pencil',
    code: 'update',
    event: ({ model, itemData }) => role.openFormDialog({ model, roleItem: itemData }),
  },
  { type: 'divider' },
  {
    title: '刪除角色',
    icon: 'mdi-delete',
    code: 'delete',
    event: ({ model, itemData }) => role.openConfirmDialog({ model, id: itemData._id }),
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

      <v-btn block color="success" @click="role.openFormDialog({ model: 'create' })">
        <v-icon size="30">mdi-plus</v-icon>
      </v-btn>
    </div>

    <v-expand-transition class="content-height">
      <v-data-table
        :headers="headers"
        :items="rolesStore.list"
        :search="search"
        density="compact"
        fixed-header
        hide-default-footer
        :items-per-page="-1"
        hover
      >
        <template v-slot:item.status="{ value }">
          <div class="d-flex justify-center">
            <v-switch
              readonly
              hide-details
              density="compact"
              color="success"
              :model-value="value"
              inset
            ></v-switch>
          </div>
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
