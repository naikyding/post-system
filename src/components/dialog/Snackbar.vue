<script setup>
import { computed } from 'vue'
import { useDialogController } from '@/stores/dialogController'

const dialogController = useDialogController()
const eventStatusBar = computed(() => dialogController.eventStatusBar)
</script>

<template>
  <div class="text-center ma-2">
    <v-snackbar :timeout="1000" :color="eventStatusBar.color" v-model="eventStatusBar.status">
      {{ eventStatusBar.text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="dialogController.eventStatusBar.status = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
