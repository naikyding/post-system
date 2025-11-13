<script setup>
import { ref } from 'vue'
import Table from './components/Table.vue'
import { useUser } from './useUser.js'
import FormDialog from './components/FormDialog.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

const tableRef = ref(null)
const formDialogRef = ref(null)
const confirmDialogRef = ref(null)

const {} = useUser({ tableRef, formDialogRef, confirmDialogRef })
</script>

<template>
  <div class="d-flex flex-column">
    <div class="bg-grey-darken-4 flex-grow-1 overflow-auto">
      <h3 class="pa-4 pb-0">Global 使用者設定</h3>
      <Table ref="tableRef" />
      <FormDialog ref="formDialogRef" />
      <ConfirmDialog ref="confirmDialogRef" />
    </div>
  </div>
</template>
