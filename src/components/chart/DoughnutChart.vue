<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import Chart from '@/utils/chart'
const doughnutChart = ref(null)
const props = defineProps(['data'])
let chartConstructor

const formatData = computed(() => {
  return props.data
    .reduce((acc, cur) => {
      cur.items.forEach((item) => {
        if (item.product.type === '塑膠提袋') return acc
        const matchProductItemByAcc = acc.find((accItem) => accItem.product === item.product.name)

        if (matchProductItemByAcc) {
          matchProductItemByAcc.quantity += item.quantity
          return acc
        } else {
          return (acc = [
            ...acc,
            {
              product: item.product.name,
              quantity: item.quantity,
            },
          ])
        }
      })
      return acc
    }, [])
    .sort((a, b) => b.quantity - a.quantity)
})

watch(
  () => props.data,
  () => {
    chartConstructor.data.labels = formatData.value
      .map((item) => item.product)
      // 取十位
      .filter((item, index) => index < 10)

    chartConstructor.data.datasets = [
      {
        label: '數量',
        data: formatData.value.map((item) => item.quantity).filter((item, index) => index < 10),
      },
    ]

    chartConstructor.update()
  },
)

function initChart() {
  return new Chart(doughnutChart.value, {
    type: 'doughnut',

    data: {
      labels: [],
      datasets: [],
    },
  })
}

onMounted(() => {
  chartConstructor = initChart()
})
</script>

<template>
  <div style="position: relative">
    <span>品項分佈 (TOP 10)</span>
    <v-divider class="my-2" />
    <canvas v-show="formatData.length > 0" ref="doughnutChart" id="myChart"></canvas>
    <p v-show="formatData.length === 0" class="text-center my-6 text-grey text-caption">
      Nothing to display
    </p>
  </div>
</template>

<style lang="scss" scoped></style>
