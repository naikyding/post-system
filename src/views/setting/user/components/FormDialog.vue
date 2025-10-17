<script setup>
import { computed, inject, ref } from 'vue'
import FormInput from './FormInput.vue'

const status = ref(false)
const form = ref(null)
const user = inject('user')

const title = computed(() => {
  const titles = {
    create: '新增使用者',
    update: '修改使用者',
    password: '修改使用者密碼',
  }

  return titles[user.active.value.model] || '--'
})

function toggleStatus() {
  status.value = !status.value
}

defineExpose({
  status,
  title,
  form,
  toggleStatus,
})
</script>

<template>
  <v-dialog v-model="status" max-width="600">
    <v-card :title="title">
      <v-form ref="form">
        <v-card-text> <FormInput /> </v-card-text>
        <v-divider></v-divider>

        <div class="pa-6">
          <v-btn @click="user[user.active.value.model]" class="" color="success" block>
            保存
          </v-btn>
          <v-btn @click="user.resetForm" class="mt-4" color="warning" block> 重置 </v-btn>
          <v-btn @click="user.cancelFormDialog" class="mt-4" color="error" variant="outlined" block>
            取消
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
