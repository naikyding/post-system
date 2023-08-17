<script setup>
// chartJS
import { Chart, Colors } from 'chart.js'
Chart.register(Colors)

console.log(Chart)
</script>

<template>
  <canvas id="okCanvas2" width="400" height="100">
    <p>Hello Fallback World</p>
  </canvas>
</template>

<style lang="scss" scoped></style>
