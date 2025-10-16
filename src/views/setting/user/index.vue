<script setup>
import { ref } from 'vue'
import Table from './components/Table.vue'
import { useUser } from './useUser.js'
import FormDialog from './components/FormDialog.vue'

const tableRef = ref(null)
const formDialogRef = ref(null)
const {} = useUser({ tableRef, formDialogRef })
</script>

<template>
  <div style="height: 100dvh">
    <h3 class="pa-4 pb-0">使用者設定</h3>
    <Table ref="tableRef" />
    <FormDialog ref="formDialogRef" />
  </div>
</template>
