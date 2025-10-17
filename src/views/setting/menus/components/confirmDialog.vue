<script setup>
import { inject, ref } from 'vue'
import { useConfirmDialog } from './useConfirmDialog.js'

const { dialogText } = useConfirmDialog()

const dialogStatus = ref(false)

function confirmDialogToggle() {
  dialogStatus.value = !dialogStatus.value
}

// 來自父層
const activeModel = inject('activeModel')
const operation = inject('operation')
const confirmDialog = inject('confirmDialog')
const menu = inject('menu')

// 提供給父層
defineExpose({ confirmDialogToggle })

const dynamicDelete = (model) => {
  if (model === 'deleteOperation') return operation[model]()
  if (model === 'deleteMenu') return menu[model]()
}
</script>

<template>
  <v-dialog v-model="dialogStatus" max-width="400" persistent>
    <v-card prepend-icon="mdi-alert" :text="dialogText[activeModel]" title="再次確認">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="error" @click="confirmDialog.cancel">取消</v-btn>
        <v-btn variant="flat" color="success" @click="dynamicDelete(activeModel)">確認</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
