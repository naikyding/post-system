<script setup>
import { onMounted, ref } from 'vue'
import Chart from '@/utils/chart'
import { computed } from 'vue'
import { watch } from 'vue'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

import { useDashboardStore } from '../../stores/dashboard'

const dataChart = ref(null)
const props = defineProps(['data'])
let chartConstructor

const dashboardStore = useDashboardStore()

// 搜尋間距 (日) 0 => 同天
const searchDayRange = computed(() =>
  dayjs(dashboardStore.searchData.from).diff(dayjs(dashboardStore.searchData.to), 'day'),
)

// 格式化資料 (選擇單日)
const dataFormat = (data) => {
  let cloneData = [...data]
  return (
    cloneData
      .reduce((acc, cur) => {
        const computedItemsQuantity = cur.items.reduce((itemAcc, itemCur) => {
          if (itemCur.product.type === '塑膠提袋') return itemAcc
          return (itemAcc += itemCur.quantity)
        }, 0)

        const createdAtFormatByDay =
          searchDayRange.value === 0
            ? // CUR createdAt 調整為整點
              dayjs(cur.createdAt).hour(dayjs(cur.createdAt).hour()).minute(0).format('HH:mm')
            : // 日期
              dayjs(cur.createdAt).format('MM-DD')

        // --------- 如果訂單只是「塑膠提袋」
        if (computedItemsQuantity === 0) return acc

        // --------- 如果有相同的 acc.createdAt
        const sameCreateAtItem = acc.find((item) => item.createdAt === createdAtFormatByDay)

        if (sameCreateAtItem) {
          sameCreateAtItem.list += 1
          sameCreateAtItem.items += computedItemsQuantity
          sameCreateAtItem.total += cur.totalPrice
          return acc
        }
        // --------- 如果有相同的 acc.createdAt

        return (acc = [
          ...acc,
          {
            createdAt: createdAtFormatByDay,
            list: 1,
            items: computedItemsQuantity,
            total: cur.totalPrice,
          },
        ])
      }, [])
      // 重新排序 createdAt 舊到新
      .sort((a, b) => {
        return dayjs(a.createdAt).isBefore(b.createdAt)
          ? searchDayRange.value === 0
            ? 1
            : -1
          : searchDayRange.value === 0
          ? -1
          : 1
      })
  )
}

const formatData = computed(() => {
  let cloneData = [...props.data]
  console.log('dataFormat(cloneData)', dataFormat(cloneData))
  return dataFormat(cloneData)
})

onMounted(() => {
  chartConstructor = initChart()
})

watch(
  () => props.data,
  () => {
    const chartType = searchDayRange.value === 0 ? 'line' : 'bar'

    chartConstructor.data.labels = formatData.value.map((item) => item.createdAt)

    chartConstructor.options.scales.y.max =
      Math.max(...formatData.value.map((item) => item.items)) + 5

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

    chartConstructor.config.type = chartType

    chartConstructor.update()
  },
)

function initChart() {
  return new Chart(dataChart.value, {
    type: 'bar',
    options: {
      scales: {
        x: { stacked: true },
        y: {
          min: 0,
          max: 40,
        },
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
  <div>
    <span>訂單趨勢</span>
    <v-divider class="my-2" />
    <canvas ref="dataChart" id="myChart" class="px-2"></canvas>
  </div>
</template>

<style lang="scss" scoped></style>
