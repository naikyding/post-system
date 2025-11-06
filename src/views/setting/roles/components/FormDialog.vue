<script setup>
import { computed, inject, ref } from 'vue'
import FormInput from './FormInput.vue'

const role = inject('role')
const status = ref(false)
const rules = ref([])
const form = ref(null)

const title = computed(() => {
  if (role.active.value.model === 'create') return '角色新增'
  if (role.active.value.model === 'update') return '角色修改'
  return '--'
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
        <v-card-text>
          <FormInput :rules="rules" />
        </v-card-text>
        <v-divider></v-divider>

        <div class="pa-6">
          <v-btn @click="role[role.active.value.model]" class="" color="success" block>
            保存
          </v-btn>
          <v-btn @click="role.resetForm" class="mt-4" color="warning" block> 重置 </v-btn>
          <v-btn @click="role.cancelFormDialog" class="mt-4" color="error" variant="outlined" block>
            取消
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
