<script setup>
import { inject, ref } from 'vue'

const status = ref(false)
const props = defineProps({
  title: {
    type: String,
  },
})

defineExpose({
  status,
})

const agent = inject('agent')
</script>

<template>
  <v-dialog v-model="status" max-width="600">
    <v-card :title="props.title">
      <v-form ref="form">
        <v-card-text>
          <slot></slot>
        </v-card-text>
        <v-divider></v-divider>

        <div class="pa-6">
          <v-btn @click="agent[agent.activeModel.value]" color="success" block> 保存 </v-btn>
          <v-btn @click="agent.resetDialog" class="mt-4" color="warning" block> 重置 </v-btn>
          <v-btn @click="agent.closeDialog" class="mt-4" color="error" variant="outlined" block>
            取消
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
