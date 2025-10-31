<script setup>
import { useRolesStore } from '@/stores/roles'
import { inject, ref } from 'vue'
const rolesStore = useRolesStore()
const search = ref('')
const headers = [
  { title: '角色名稱', key: 'name' },
  { title: '代碼', key: 'code' },
  { title: '狀態', key: 'status', align: 'center' },
  { title: '操作', key: 'actions', align: 'center' },
]

const role = inject('role')
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
          <v-btn
            @click="role.openMenuAndOperationDrawer({ model: 'menus', roleItem: item })"
            icon="mdi-sitemap"
            size="40"
            variant="plain"
            color="success"
          ></v-btn>
          <!-- 修改 -->
          <v-btn
            icon="mdi-pencil"
            size="40"
            variant="plain"
            color="warning"
            @click="role.openFormDialog({ model: 'update', roleItem: item })"
          ></v-btn>
          <!-- 刪除 -->
          <v-btn
            @click="role.openConfirmDialog({ model: 'delete', id: item._id })"
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
