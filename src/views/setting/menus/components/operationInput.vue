<script setup>
import { inject } from 'vue'

const operation = inject('operation')

defineProps({
  rules: {
    type: Object,
  },
})
</script>

<template>
  <!-- 使用在 operation 的欄位 -->
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
</template>
