<script setup>
import { useConfirmDialog } from './useConfirmDialog.js'

const { dialogStatus, model, operations, activeId, dialogText, reset, snackbarStatus } =
  useConfirmDialog()

function openConfirmDialog(type, id) {
  model.value = type
  if (id) activeId.value = id
  dialogStatus.value = true
}

// 提供給父層
defineExpose({ openConfirmDialog })
</script>

<template>
  <v-dialog v-model="dialogStatus" max-width="400" persistent>
    <v-card prepend-icon="mdi-alert" :text="dialogText[model]" title="再次確認">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="error" @click="reset">取消</v-btn>
        <v-btn variant="flat" color="success" @click="operations[model]">確認</v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-snackbar variant="tonal" :timeout="2000" color="success" v-model="snackbarStatus">
    操作成功!
  </v-snackbar>
</template>
