<script setup>
import SystemSidebar from './components/SystemSidebar.vue'
import StatusDialog from './components/dialog/StatusDialog.vue'
</script>

<template>
  <SystemSidebar>
    <RouterView />
  </SystemSidebar>

  <!-- 狀態 dialog -->
  <StatusDialog />
</template>

<style scoped></style>
