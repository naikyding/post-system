<script setup>
import SystemLayout from './views/SystemLayout.vue'
import ProgressAlert from './components/dialog/progressAlert.vue'
</script>

<template>
  <!-- progress alert -->
  <ProgressAlert />
  <SystemLayout>
    <RouterView />
  </SystemLayout>
</template>

<style scoped></style>
