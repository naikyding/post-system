<script setup>
import { watch } from 'vue'
import ProgressAlert from './components/dialog/progressAlert.vue'
import { RouterView, useRoute } from 'vue-router'
import VConsole from 'vconsole'

const route = useRoute()

watch(
  () => route.query,
  (newRouteQuery) => {
    if (newRouteQuery.log) new VConsole()
  },
)
</script>

<template>
  <!-- progress alert -->
  <ProgressAlert />
  <RouterView />
</template>

<style scoped></style>
