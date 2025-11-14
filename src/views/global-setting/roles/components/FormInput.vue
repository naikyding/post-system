<script setup>
import { inject } from 'vue'

const role = inject('role')
</script>

<template>
  <v-row dense>
    <v-col cols="12">
      <v-text-field
        v-model="role.form.value.name"
        label="名稱"
        variant="outlined"
        required
        :rules="[role.formRules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="role.form.value.code"
        label="代碼"
        variant="outlined"
        required
        :rules="[role.formRules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="role.form.value.description"
        label="說明"
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <div class="d-flex" :style="{ height: '56px' }">
        <v-switch
          v-model="role.form.value.status"
          label="狀態"
          hide-details
          density="compact"
          color="success"
          inset
        ></v-switch>
      </div>
    </v-col>
    <v-col cols="12">
      <div class="d-flex" :style="{ height: '56px' }">
        <v-switch
          v-model="role.form.value.isSystem"
          label="系統設定"
          hide-details
          density="compact"
          color="success"
          inset
        ></v-switch>
      </div>
    </v-col>
  </v-row>
</template>
