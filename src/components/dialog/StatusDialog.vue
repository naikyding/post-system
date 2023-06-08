<script setup>
import { useAppStore } from '../../stores/app'

const appStore = useAppStore()
const statusDialog = appStore.statusDialog
</script>

<template>
  <v-dialog v-model="statusDialog.status" transition="dialog-bottom-transition" width="360">
    <v-alert
      :type="statusDialog.type"
      :title="statusDialog.title"
      :text="statusDialog.text"
    ></v-alert>
  </v-dialog>
</template>

<style lang="scss" scoped></style>
