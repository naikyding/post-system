<script setup>
import { inject } from 'vue'

const paymentTypes = inject('paymentTypes')
</script>

<template>
  <v-row density="comfortable">
    <v-col cols="12">
      <v-text-field
        v-model.number="paymentTypes.form.value.sort"
        :rules="[paymentTypes.formRules.sort]"
        label="排序"
        type="number"
        min="0"
        variant="outlined"
        hint="數字越小越前面"
        persistent-hint
      />
    </v-col>

    <!-- 建立時才可輸入 -->
    <v-col v-if="paymentTypes.active.value.model === 'create'" cols="12">
      <v-text-field
        v-model.trim="paymentTypes.form.value.code"
        :rules="[paymentTypes.formRules.code]"
        label="代碼 (Code)"
        variant="outlined"
        hint="建立後不可修改，例如：cash、linepay"
        persistent-hint
        required
      />
    </v-col>

    <v-col cols="12">
      <v-text-field
        v-model="paymentTypes.form.value.name"
        :rules="[paymentTypes.formRules.name]"
        label="名稱"
        variant="outlined"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-color-input
        v-model="paymentTypes.form.value.color"
        clearable
        color-pip
        pip-location="append"
        label="顏色"
        variant="outlined"
      ></v-color-input>
    </v-col>

    <v-col cols="12">
      <v-switch
        v-model="paymentTypes.form.value.status"
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
        v-model="paymentTypes.form.value.isDefault"
        label="設為預設"
        color="success"
        inset
        hide-details
      />
    </v-col>
  </v-row>
</template>
