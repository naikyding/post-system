<script setup>
import { inject, ref } from 'vue'

const role = inject('role')
const status = ref(false)
const text = '確定刪除選擇的項目?'

defineExpose({
  status,
})
</script>

<template>
  <v-dialog v-model="status" max-width="400">
    <v-card prepend-icon="mdi-alert" title="警告">
      <v-card-text>
        {{ text }}
      </v-card-text>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="role.cancelConfirmDialog" variant="outlined" color="error">取消</v-btn>
        <v-btn @click="role.deleteItem" variant="flat" color="success">確認</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
