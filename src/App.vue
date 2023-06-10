<script setup>
import SystemSidebar from './components/SystemSidebar.vue'
import ProgressAlert from './components/dialog/progressAlert.vue'
</script>

<template>
  <SystemSidebar>
    <RouterView />
  </SystemSidebar>

  <!-- progress alert -->
  <ProgressAlert />
</template>

<style scoped></style>
