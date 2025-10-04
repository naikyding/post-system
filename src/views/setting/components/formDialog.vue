<script setup>
import { inject, ref } from 'vue'
import { useOperationFormDialog } from './useOperationFormDialog'
import operationInput from './operationInput.vue'
import menuInput from './menuInput.vue'

const status = ref(false)
const operation = inject('operation')
const form = ref(null)
const { validate, reset, rules } = useOperationFormDialog(form)

defineExpose({
  status,
  resetOperationForm: reset,
  validateOperationForm: validate,
})

const activeModel = inject('activeModel')

function resetFrom() {
  operation.resetOperationForm()
}

const dynamicCardTitle = (model) => {
  if (['createOperation', 'createMenu'].includes(model)) return `新增操作項目`
  if (['updateOperation', 'updateMenu'].includes(model)) return `修改操作項目`
}

const dynamicInput = (model) => {
  if (['createOperation', 'updateOperation'].includes(model)) return operationInput
  if (['createMenu', 'updateMenu'].includes(model)) return menuInput
}
</script>

<template>
  <v-dialog v-model="status" max-width="600" persistent>
    <v-card :title="dynamicCardTitle(activeModel)">
      <v-form ref="form">
        <v-card-text>
          <component :is="dynamicInput(activeModel)" :rules="rules" />
        </v-card-text>
        <v-divider></v-divider>
        {{ activeModel }}
        <div class="pa-6">
          <v-btn class="" color="success" block @click="operation[operation.model.value]">
            保存
          </v-btn>

          <v-btn class="mt-4" color="warning" block @click="resetFrom"> 重置 </v-btn>
          <v-btn
            class="mt-4"
            color="error"
            variant="outlined"
            block
            @click="operation.cancelOperation"
          >
            取消
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
