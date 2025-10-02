<script setup>
import { inject, ref } from 'vue'
import { useOperationFormDialog } from './useOperationFormDialog'

const status = ref(false)
const operation = inject('operation')
const form = ref(null)
const { validate, reset, rules } = useOperationFormDialog(form)

defineExpose({
  status,
  resetOperationForm: reset,
  validateOperationForm: validate,
})

function resetFrom() {
  operation.resetOperationForm()
}
</script>

<template>
  <v-dialog v-model="status" max-width="600">
    <v-card title="新增操作項目">
      <v-form ref="form">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="operation.form.value.name"
                label="名稱"
                variant="outlined"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="operation.form.value.description"
                label="說明"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="operation.form.value.operate"
                label="功能名稱"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="operation.form.value.action"
                label="動作"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                disabled
                v-model="operation.form.value.menuId"
                label="選單 ID"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <div class="pa-6">
          <v-btn class="" color="success" block @click="operation[operation.model.value]">
            新增
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
