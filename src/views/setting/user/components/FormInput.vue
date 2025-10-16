<script setup>
import { inject } from 'vue'

const user = inject('user')
</script>

<template>
  <v-row dense>
    <v-col cols="12">
      <v-text-field
        v-model="user.form.value.email"
        label="email"
        variant="outlined"
        required
        :rules="[user.formRules.required]"
      ></v-text-field>
    </v-col>
    <v-col v-if="user.active.value.model === 'create'" cols="12">
      <v-text-field
        v-model="user.form.value.password"
        label="密碼"
        variant="outlined"
        required
        :rules="[user.formRules.required]"
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-text-field
        v-model="user.form.value.nickname"
        label="綽號"
        variant="outlined"
        required
        :rules="[user.formRules.required]"
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-text-field v-model="user.form.value.phone" label="手機" variant="outlined"></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field v-model="user.form.value.note" label="備註" variant="outlined"></v-text-field>
    </v-col>
  </v-row>
</template>
