<script setup>
import { ref } from 'vue'
import Table from './components/Table.vue'
import FormDialog from './components/FormDialog.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

const tableRef = ref(null)
const formDialogRef = ref(null)
const confirmDialogRef = ref(null)

import { useMarkers } from './useMarkers.js'

const {} = useMarkers({ tableRef, formDialogRef, confirmDialogRef })
</script>

<template>
  <div class="" :style="{ height: 'calc(100dvh - 48px)' }">
    <h3 class="pa-4 pb-0">標籤設定</h3>
    <Table ref="tableRef" />
    <FormDialog ref="formDialogRef" />
    <ConfirmDialog ref="confirmDialogRef" />
  </div>
</template>
