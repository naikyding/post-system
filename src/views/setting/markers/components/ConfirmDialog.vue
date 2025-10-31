<script setup>
import { inject, ref } from 'vue'

const markers = inject('markers')
const status = ref(false)
defineExpose({
  status,
})
</script>

<template>
  <v-dialog v-model="status" max-width="400">
    <v-card prepend-icon="mdi-alert" title="警告">
      <v-card-text>
        {{ `確定刪除 ${markers.active.value?.data?.name} 這個項目嗎 ?` }}
      </v-card-text>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="markers.cancelConfirmDialog" variant="outlined" color="error">取消</v-btn>
        <v-btn @click="markers.deleteItem" variant="flat" color="success">確認</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
