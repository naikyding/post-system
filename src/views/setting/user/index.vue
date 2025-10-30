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
  <div class="bg-grey-darken-4" style="height: 100dvh">
    <h3 class="pa-4 pb-0">使用者設定</h3>
    <Table ref="tableRef" />
    <FormDialog ref="formDialogRef" />
    <ConfirmDialog ref="confirmDialogRef" />
  </div>
</template>
