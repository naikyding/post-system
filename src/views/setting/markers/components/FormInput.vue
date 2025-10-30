<script setup>
import { inject } from 'vue'

const markers = inject('markers')
</script>

<template>
  <v-row dense>
    <v-col cols="12">
      <v-text-field
        v-model="markers.form.value.name"
        label="名稱"
        variant="outlined"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-textarea
        v-model="markers.form.value.description"
        label="說明"
        variant="outlined"
      ></v-textarea>
    </v-col>
  </v-row>
</template>
