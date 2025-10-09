<script setup>
import { ref } from 'vue'
import { useRoles } from './useRoles'

import Table from './components/Table.vue'
import FormDialog from './components/FormDialog.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

const tableRef = ref(null)
const formDialogRef = ref(null)
const confirmDialogRef = ref(null)

const { rolesStore, active } = useRoles({ tableRef, formDialogRef, confirmDialogRef })
</script>

<template>
  <div style="height: 100dvh">
    <h3 class="pa-4 pb-0">角色設定</h3>
    <Table ref="tableRef" />
    <FormDialog ref="formDialogRef" />
    <ConfirmDialog ref="confirmDialogRef" />
  </div>
</template>
