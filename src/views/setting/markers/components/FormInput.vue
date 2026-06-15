<script setup>
import { inject } from 'vue'

const markers = inject('markers')
</script>

<template>
  <v-row dense>
    <v-col cols="12">
      <v-text-field
        v-model="markers.form.value.name"
        :rules="[markers.formRules.name]"
        label="名稱"
        variant="outlined"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-text-field
        v-model.number="markers.form.value.sort"
        :rules="[markers.formRules.sort]"
        label="排序"
        type="number"
        min="0"
        variant="outlined"
        hint="數字越小越前面"
        persistent-hint
      />
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
