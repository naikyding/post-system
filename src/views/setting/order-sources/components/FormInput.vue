<script setup>
import { inject } from 'vue'

const orderSources = inject('orderSources')
</script>

<template>
  <v-row dense>
    <v-col cols="12">
      <v-text-field
        v-model.number="orderSources.form.value.sort"
        :rules="[orderSources.formRules.sort]"
        label="排序"
        type="number"
        min="0"
        variant="outlined"
        hint="數字越小越前面"
        persistent-hint
      />
    </v-col>

    <v-col cols="12">
      <v-text-field
        v-model="orderSources.form.value.name"
        :rules="[orderSources.formRules.name]"
        label="名稱"
        variant="outlined"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-switch
        v-model="orderSources.form.value.status"
        label="顯示"
        color="success"
        false-value="inactive"
        true-value="active"
        inset
        hide-details
      ></v-switch>
    </v-col>
    <v-col cols="12">
      <v-switch
        v-model="orderSources.form.value.isDefault"
        label="設為預設"
        color="success"
        inset
        hide-details
      />
    </v-col>
  </v-row>
</template>
