<script setup>
import { onMounted, ref } from 'vue'
import Chart from '@/utils/chart'
import { computed } from 'vue'
import { watch } from 'vue'
import dayjs from 'dayjs'

const dataChart = ref(null)
const props = defineProps(['data'])
let chartConstructor

// 格式化資料 (選擇單日)
const originDataToFormatData = (data) => {
  let cloneData = [...data]
  return (
    cloneData
      .reduce((acc, cur) => {
        const computedItemsQuantity = cur.items.reduce((itemAcc, itemCur) => {
          if (itemCur.product.type === '塑膠提袋') return itemAcc
          return (itemAcc += itemCur.quantity)
        }, 0)

        // CUR createdAt 調整為整點
        const formatCurCreateAtMinToZero = dayjs(cur.createdAt)
          .hour(dayjs(cur.createdAt).hour())
          .minute(0)
          .format('HH:mm')

        // --------- 如果訂單只是「塑膠提袋」
        if (computedItemsQuantity === 0) return acc

        // --------- 如果有相同的 acc.createdAt
        const sameCreateAtItem = acc.find((item) => item.createdAt === formatCurCreateAtMinToZero)

        if (sameCreateAtItem) {
          sameCreateAtItem.list += 1
          sameCreateAtItem.items += computedItemsQuantity
          return acc
        }
        // --------- 如果有相同的 acc.createdAt

        return (acc = [
          ...acc,
          {
            createdAt: dayjs(cur.createdAt)
              .hour(dayjs(cur.createdAt).hour())
              .minute(0)
              .format('HH:mm'),
            list: 1,
            items: computedItemsQuantity,
          },
        ])
      }, [])
      // 重新排序 createdAt 舊到新
      .sort((a, b) => (dayjs(a.createdAt).isBefore(b.createdAt) ? 1 : -1))
  )
}

const formatData = computed(() => {
  let cloneData = [...props.data]
  return originDataToFormatData(cloneData)
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
