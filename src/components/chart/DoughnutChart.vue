<script setup>
import { onMounted, ref } from 'vue'
import Chart from '@/utils/chart'
const dataChart = ref(null)

onMounted(() => {
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ]

  new Chart(dataChart.value, {
    type: 'doughnut',

    data: {
      labels: data.map((row) => row.year),
      datasets: [
        {
          label: '數量',
          data: data.map((row) => row.count),
        },
      ],
    },
  })
})
</script>

<template>
  <canvas ref="dataChart" id="myChart"></canvas>
</template>

<style lang="scss" scoped></style>
