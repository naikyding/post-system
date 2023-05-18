<script setup>
import SystemSidebar from './components/SystemSidebar.vue'
import { postOrderListAPI } from '@/api'

postOrderListAPI({ id: 123 })
</script>

<template>
  <SystemSidebar>
    <RouterView />
  </SystemSidebar>
</template>

<style scoped></style>
