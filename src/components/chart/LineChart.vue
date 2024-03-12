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

        let allBagItems = 0

        let computed = item.items.reduce(
          (acc, cur, curIndex) => {
            // 營業額
            acc.total += cur.totalPrice

            if (cur.product.type === '塑膠提袋') {
              allBagItems += 1
              return acc
            }

            if (item.items.length === curIndex + 1 && allBagItems !== curIndex + 1) {
              acc.list += 1
              allBagItems = 0
            }

            acc.items += cur.quantity
            return acc
          },
          {
            list: 0, // 訂單
            items: 0, // 片數
            total: 0, // 營業額
          },
        )

        timeObj[index - 1]['list'] += computed.list
        timeObj[index - 1]['items'] += computed.items
        timeObj[index - 1]['total'] += computed.total

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

    chartConstructor.data.datasets = [
      {
        label: '訂單',
        data: formatData.value.map((item) => item.list),
      },
      {
        label: '片數',
        data: formatData.value.map((item) => item.items),
      },
    ]

    chartConstructor.update()
  },
)

function initChart() {
  return new Chart(dataChart.value, {
    type: 'line',
    options: {
      scales: {
        y: { min: 0, max: 40 },
      },
    },
    data: {
      labels: [],
      datasets: [],
    },
  })
}
</script>

<template>
  <div class="my-4">
    <span>訂單趨勢</span>
    <v-divider class="my-2" />
    <canvas ref="dataChart" id="myChart" class="px-2"></canvas>
  </div>
</template>

<style lang="scss" scoped></style>
