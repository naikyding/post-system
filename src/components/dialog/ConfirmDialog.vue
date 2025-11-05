<script setup>
import { ref } from 'vue'

const status = ref(false)

const props = defineProps({
  title: String,
  text: String,
})

const emit = defineEmits(['cancel-event', 'save-event'])
defineExpose({
  status,
})

function closeDialog() {
  status.value = false
}

function cancel() {
  emit('cancel-event')
  // closeDialog()
}
function save() {
  emit('save-event')
  closeDialog()
}
</script>

<template>
  <div>
    <v-dialog v-model="status" max-width="400" persistent>
      <v-card
        prepend-icon="mdi-alert"
        :title="props.title || '最後確認'"
        :text="props.text || '你確定要繼續嗎？'"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <div class="d-flex flex-column w-100">
            <v-btn class="my-1" size="large" block variant="outlined" color="error" @click="cancel">
              No
            </v-btn>
            <v-btn class="my-1" size="large" block variant="flat" color="success" @click="save">
              Yes
            </v-btn>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
