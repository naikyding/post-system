<script setup>
import { inject, ref } from 'vue'

const status = ref(false)
const role = inject('role')

defineExpose({
  status,
})
</script>

<template>
  <v-navigation-drawer v-model="status" location="right" temporary>
    <v-card subtitle="權限管理">
      <template v-slot:title>
        <span class="font-weight-black">{{ role.active.value.item?.name }}</span>
      </template>
    </v-card>
    <v-divider></v-divider>

    <v-list-item link title="List Item 1"></v-list-item>
    <v-list-item link title="List Item 2"></v-list-item>
    <v-list-item link title="List Item 3"></v-list-item>

    <template v-slot:append>
      <div class="pa-4">
        <v-btn block color="success">保存</v-btn>
        <v-btn class="mt-3" variant="outlined" block color="error">取消</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
