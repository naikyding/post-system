<script setup>
import { inject } from 'vue'

const menu = inject('menu')

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
        v-model.trim.number="menu.form.value.sort"
        label="排序"
        variant="outlined"
        :rules="[rules.required, rules.isNumber]"
        type="number"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="menu.form.value.name"
        label="名稱"
        variant="outlined"
        :rules="[rules.required]"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="menu.form.value.description"
        label="說明"
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field v-model="menu.form.value.icon" label="圖示" variant="outlined"></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="menu.form.value.routeName"
        label="路由名稱"
        variant="outlined"
        :rules="[rules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="menu.form.value.path"
        label="路由"
        variant="outlined"
        :rules="[rules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="menu.form.value.component"
        label="組件位置"
        variant="outlined"
        :rules="[rules.required]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="menu.form.value.redirect"
        label="跳轉路由"
        variant="outlined"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        disabled
        v-model="menu.form.value.parentId"
        label="上層選單"
        variant="outlined"
      ></v-text-field>
    </v-col>
  </v-row>
</template>
