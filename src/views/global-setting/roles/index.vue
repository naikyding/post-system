<script setup>
import { ref } from 'vue'
import { useRoles } from './useRoles'

import Table from './components/Table.vue'
import FormDialog from './components/FormDialog.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import MenuAndOperationDrawer from './components/MenuAndOperationDrawer.vue'

const tableRef = ref(null)
const formDialogRef = ref(null)
const confirmDialogRef = ref(null)
const menuAndOperationDrawerRef = ref(null)

const { rolesStore, active } = useRoles({
  tableRef,
  formDialogRef,
  confirmDialogRef,
  menuAndOperationDrawerRef,
})
</script>

<template>
  <div class="bg-grey-darken-4 pa-2" :style="{ height: 'calc(100dvh - 48px)' }">
    <h3 class="pa-4">Global 角色設定</h3>
    <Table ref="tableRef" />
    <FormDialog ref="formDialogRef" />
    <ConfirmDialog ref="confirmDialogRef" />
    <MenuAndOperationDrawer ref="menuAndOperationDrawerRef" />
  </div>
</template>
