<script setup>
import { onMounted, ref } from 'vue'
import Chart from '@/utils/chart'
import { computed } from 'vue'
import { watch } from 'vue'
import dayjs from 'dayjs'

const dataChart = ref(null)
const props = defineProps(['data'])
let chartConstructor

const timeRange = computed(() => {
  let timeAry = []
  for (let i = 14; i <= 23; i++) {
    timeAry = [...timeAry, `${i}:00`, `${i}:30`]
  }
  return timeAry
})

const formatData = computed(() => {
  return props.data
})

onMounted(() => {
  chartConstructor = initChart()
})

watch(
  () => props.data,
  () => {
    console.log('line watch')
    console.log(chartConstructor)
    console.log('formatData', formatData)

    chartConstructor.data.labels = formatData.value
      .map((item) => {
        console.log(typeof dayjs(item.createdAt).format('HH:mm'))
        return dayjs(item.createdAt).format('HH:mm')
      })
      .reverse()

    chartConstructor.data.datasets.forEach(
      (dataset) => (dataset.data = formatData.value.map((item) => item.items.length).reverse()),
    )

    chartConstructor.update()
  },
)

function initChart() {
  return new Chart(dataChart.value, {
    type: 'line',
    options: {
      scales: {
        y: { min: 0, max: 5 },
      },
    },
    data: {
      labels: [],
      datasets: [
        {
          label: '數量',
          data: [],
        },
      ],
    },
  })
}
</script>

<template>
  <canvas ref="dataChart" id="myChart"></canvas>
</template>

<style lang="scss" scoped></style>
