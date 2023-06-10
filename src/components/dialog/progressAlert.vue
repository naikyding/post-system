<script setup>
import { useAppStore } from '../../stores/app'

const appStore = useAppStore()
</script>

<template>
  <v-dialog v-model="appStore.progressStatus" width="100" persistent>
    <v-card height="100" class="justify-center align-center rounded-xl">
      <v-progress-circular :size="70" :width="7" color="teal" indeterminate></v-progress-circular>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped></style>
