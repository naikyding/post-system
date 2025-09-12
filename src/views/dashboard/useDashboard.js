import { ref, onMounted, computed, reactive, watch } from 'vue'
import dayJs from 'dayjs'
import { dateFormat } from '@/utils/day'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
dayJs.extend(quarterOfYear)

import { useDashboardStore } from '@/stores/dashboard'

export function useDashboard() {
  const dashboardStore = useDashboardStore()

  const datePicker = reactive({
    dialog: false,
  })

  const showPaymentList = ref({
    type: null,
    sheet: false,
    list: computed(() => {
      // 由新到舊排序
      return (
        dashboardStore.dashboardData.total.completed
          .find((item) => item.type === showPaymentList.value.type)
          ?.data.sort((a, b) => dayJs(b.createdAt) - dayJs(a.createdAt)) || []
      )
    }),
  })

  function checkPaymentList(type) {
    showPaymentList.value.type = type
    showPaymentList.value.sheet = true
  }

  watch(
    () => showPaymentList.value.sheet,
    (status) => {
      if (status) return false

      showPaymentList.value.type = null
    },
  )

  const completedTotalAmount = computed(() =>
    dashboardStore.dashboardData.total.completed.reduce((init, cur) => (init += cur.total), 0),
  )

  const pendingTotalAmount = computed(() =>
    dashboardStore.dashboardData.total.pending.reduce((init, cur) => (init += cur.total), 0),
  )

  const cancelledTotalAmount = computed(() =>
    dashboardStore.dashboardData.total.cancelled.reduce((init, cur) => (init += cur.total), 0),
  )

  const completedPayTypeTotalAmount = computed(() =>
    dashboardStore.dashboardData.total.completed.reduce(
      (init, cur) => {
        if (cur.type === 'cash') {
          init['cash'] = cur.total
        }
        if (cur.type === 'Line Pay') {
          init['linePay'] = cur.total
        }
        return init
      },
      { cash: 0, linePay: 0 },
    ),
  )

  const completedTotalOrder = computed(() =>
    dashboardStore.dashboardData.total.completed.reduce(
      (init, cur) => (init += cur.orderQuantity),
      0,
    ),
  )

  const completedTotalQuantity = computed(() =>
    dashboardStore.dashboardData.total.completed.reduce(
      (init, cur) => (init += cur.itemQuantity),
      0,
    ),
  )

  onMounted(() => {
    dashboardStore.getDashboardData(dashboardStore.formatSearchQueryString)
  })

  function datePickerCancel() {
    datePicker.dialog = false
  }

  const dateModel = ref(null)

  function watchDatePicker() {
    console.log('watchDatePicker')
  }

  async function updateDateModel(date) {
    console.log('updateDateModel')
    await date.forEach((item, index, array) => {
      if (index === 0) dashboardStore.searchData.from = dateFormat(item)
      if (index === 0 && array.length < 2) dashboardStore.searchData.to = dateFormat(item)
      if (index === 1) dashboardStore.searchData.to = dateFormat(item)
    })
    dashboardStore.getDashboardData(dashboardStore.formatSearchQueryString)
  }

  function searchDataByDatePicker(searchDate) {
    dashboardStore.searchData.from = searchDate.start
    dashboardStore.searchData.to = searchDate.end

    dashboardStore.getDashboardData(dashboardStore.formatSearchQueryString)
  }

  const dataTable = ref({
    headers: [
      { title: '類別', key: 'type' },
      { title: '名稱', key: 'name' },
      { title: '數量', key: 'quantity' },
    ],
    list: computed(() => dashboardStore.dashboardData.completedTotalItem),
  })

  console.log('useDashboard')

  return {
    checkPaymentList,
    completedTotalAmount,
    pendingTotalAmount,
    cancelledTotalAmount,
    completedPayTypeTotalAmount,
    completedTotalOrder,
    completedTotalQuantity,
    datePickerCancel,
    dateModel,
    watchDatePicker,
    updateDateModel,
    searchDataByDatePicker,
    dataTable,
    dashboardStore,
    showPaymentList,
  }
}
