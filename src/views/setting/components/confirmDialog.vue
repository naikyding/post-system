<script setup>
import { inject, ref } from 'vue'
import { useConfirmDialog } from './useConfirmDialog.js'

const { dialogText, reset } = useConfirmDialog()

const dialogStatus = ref(false)

function confirmDialogToggle() {
  dialogStatus.value = !dialogStatus.value
}

// 來自父層
const activeModel = inject('activeModel')
const operation = inject('operation')

// 提供給父層
defineExpose({ confirmDialogToggle })
</script>

<template>
  <v-dialog v-model="dialogStatus" max-width="400" persistent>
    <v-card prepend-icon="mdi-alert" :text="dialogText[activeModel]" title="再次確認">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="error" @click="reset">取消</v-btn>
        <v-btn variant="flat" color="success" @click="operation[activeModel]">確認</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
