<script setup>
import ProgressAlert from './components/dialog/progressAlert.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- progress alert -->
  <ProgressAlert />
  <RouterView />
</template>

<style scoped></style>
