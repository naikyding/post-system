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
  <!-- 使用在 menu 的欄位 -->
  <v-row dense>
    <v-col cols="12">
      <v-text-field
        v-model="operation.form.value.sort"
        label="排序"
        variant="outlined"
        :rules="[rules.required]"
        required
      ></v-text-field>
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
        v-model="operation.form.value.icon"
        label="圖示"
        variant="outlined"
        :rules="[rules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="operation.form.value.routeName"
        label="路由名稱"
        variant="outlined"
        :rules="[rules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="operation.form.value.path"
        label="路由"
        variant="outlined"
        :rules="[rules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        disabled
        v-model="operation.form.value.component"
        label="組件位置"
        variant="outlined"
        :rules="[rules.required]"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
