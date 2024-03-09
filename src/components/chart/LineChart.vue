<script setup>
import { onMounted, ref } from 'vue'
import Chart from '@/utils/chart'
import { computed } from 'vue'
import { watch } from 'vue'
import dayjs from 'dayjs'

const dataChart = ref(null)
const props = defineProps(['data'])
let chartConstructor

const timeRange = () => {
  let timeAry = []
  for (let i = 14; i <= 23; i++) {
    timeAry = [
      ...timeAry,
      {
        createdAt: i,
        list: 0,
        items: 0,
      },
    ]
  }
  return timeAry
}

const formatData = computed(() => {
  let timeObj = [...timeRange()]
  let cloneData = [...props.data]

  timeObj.forEach(
    (item) =>
      (item.createdAt = cloneData[0]
        ? dayjs(cloneData[0]['createdAt']).hour(item.createdAt).minute(0)
        : dayjs().hour(item.createdAt).minute(0)),
  )
  const sortDataByCreatedAt = cloneData.sort((a, b) =>
    dayjs(a.createdAt).isBefore(b.createdAt) ? -1 : 1,
  )

  sortDataByCreatedAt.forEach((item) => {
    item.createdAt = dayjs(item.createdAt)
    let status = true
    timeObj.forEach((itemItem, index) => {
      if (item.createdAt.isBefore(itemItem.createdAt) && status) {
        status = false
        timeObj[index - 1]['list'] += 1
        return false
      }
    })
  })

  timeObj.forEach((item) => (item.createdAt = dayjs(item.createdAt).format('HH:mm')))
  return timeObj
})

onMounted(() => {
  chartConstructor = initChart()
})

watch(
  () => props.data,
  () => {
    chartConstructor.data.labels = formatData.value.map((item) => item.createdAt)

    chartConstructor.data.datasets.forEach(
      (dataset) => (dataset.data = formatData.value.map((item) => item.list)),
    )

    chartConstructor.update()
  },
)

function initChart() {
  return new Chart(dataChart.value, {
    type: 'line',
    options: {
      scales: {
        y: { min: 0, max: 30 },
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
