<script setup>
import { inject, onMounted, ref } from 'vue'

const status = ref(false)
const operation = inject('operation')

defineExpose({
  status,
})

onMounted(() => {})
</script>

<template>
  <v-dialog v-model="status" max-width="600">
    <v-card title="新增操作項目">
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="operation.form.value.name"
              label="名稱"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="operation.form.value.description"
              label="說明"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="operation.form.value.operate"
              label="功能名稱"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="operation.form.value.action"
              label="動作"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              disabled
              v-model="operation.form.value.menuId"
              label="選單 ID"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="error" text="Close" variant="outlined" @click="dialog = false"></v-btn>

        <v-btn
          color="success"
          text="Save"
          variant="flat"
          @click="operation[operation.model.value]"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
