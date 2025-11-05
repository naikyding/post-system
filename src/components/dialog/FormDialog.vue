<script setup>
import {} from 'vue'

const status = defineModel()
const emit = defineEmits(['submitEvent', 'cancelEvent', 'resetEvent'])
const props = defineProps({
  title: {
    type: String,
    default: '--',
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <v-dialog v-model="status" max-width="600">
    <v-card :title="props.title" :prepend-icon="props.icon">
      <v-form ref="form">
        <v-card-text>
          <slot />
        </v-card-text>
        <v-divider></v-divider>

        <div class="pa-6">
          <v-btn @click="emit('submitEvent')" class="" color="success" block> 保存 </v-btn>
          <v-btn @click="emit('resetEvent')" class="mt-4" color="warning" block> 重置 </v-btn>
          <v-btn @click="emit('cancelEvent')" class="mt-4" color="error" variant="outlined" block>
            取消
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
