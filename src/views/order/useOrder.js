import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useDisplay } from 'vuetify'

import { useProductsStore, useMarkersStore } from '@/stores/products'
import { useOrdersStore } from '@/stores/orders'
import dayjs from 'dayjs'

export function useOrder() {
  // order page 邏輯
  const productsStore = useProductsStore()
  const ordersStore = useOrdersStore()
  const markerStore = useMarkersStore()
  const display = useDisplay()
  const tabActiveId = ref(0)

  const dialog = reactive({
    // 選擇產品
    activeProductItem: false,
    // 確認訂單
    confirmOrderList: false,

    // 客製訂單時間
    scheduleAt: false,
  })

  const schedule = reactive({
    date: null,
    time: null,
    menu2: false,
    timeModal: false,
    dateModal: false,
  })

  const cancelSettingDateAndTime = () => {
    schedule.date = null
    schedule.time = null
    delete ordersStore.ordersList.scheduledAt
    dialog.scheduleAt = false
  }

  const submitList = (data) => {
    ordersStore.submitOrderList(data)
    cancelSettingDateAndTime()
  }

  const setScheduleDateDone = () => {
    let settingDateAndTime
    schedule.dateModal = false
    const [hour, minute] = schedule.time.split(':')

    settingDateAndTime = dayjs(schedule.date).set('hour', hour).set('minute', minute).toISOString()
    console.log('settingDateAndTime (Z+0) =>', settingDateAndTime)
    ordersStore.ordersList.scheduledAt = settingDateAndTime
    dialog.scheduleAt = false
  }

  const parseDate = ref(null)

  watch(
    () => schedule.date,
    (pickDate) => {
      parseDate.value = !pickDate ? null : dayjs(pickDate).format('YYYY/MM/DD')
    },
  )

  const cancelScheduleDateNTime = (schedule, type) => {
    schedule[type] = null

    schedule[`${type}Modal`] = false
  }

  const showScheduleDialog = () => {
    if (schedule.date === null) resetDateTime()
    dialog.scheduleAt = true
  }

  const computedDialog = reactive({
    status: false,
    deposit: 0,
    computedNumber: computed(() =>
      computedDialog.deposit > ordersStore.ordersList.total.totalPrice
        ? computedDialog.deposit - ordersStore.ordersList.total.totalPrice
        : '--',
    ),
  })

  const resetDateTime = () => {
    const now = dayjs()
    schedule.date = now.format('YYYY-MM-DD')
    schedule.time = now.format('HH:mm')
  }

  const rules = reactive({
    activeProductItemQuantity: {
      required: (value) => !!value || 'Required',
      min: (value) => value > 0 || 'EnsureQuantityPositive',
      check: (quantity) => {
        if (quantity < 0 && quantity !== '') ordersStore.activeProductItem.quantity = 1
      },
    },
  })

  watch(
    () => computedDialog.status,
    (newValue) => {
      if (!newValue) computedDialog.deposit = 0
    },
  )

  // 選擇產a 關閉 -> 重置 resetActiveProductItem
  watch(
    () => dialog.activeProductItem,
    (newStatus) => {
      if (!newStatus) ordersStore.resetActiveProductItem()
    },
  )

  onMounted(async () => {
    // 取得產品最表
    await productsStore.getProducts()
    await markerStore.getMarkers()
    tabActiveId.value = 0
  })

  // 篩選 "上架" 商品
  const activeProductItems = (productItems) =>
    productItems.filter((productItem) => productItem.status === 'active')

  const activeProducts = (allProducts) => {
    return allProducts.filter((productItem) => {
      const activeProduct = productItem.items.filter((item) => item.status === 'active')
      if (activeProduct.length > 0) return productItem
    })
  }

  const stashOrderList = () => {
    dialog.confirmOrderList = false
    const stashOrderList = JSON.parse(localStorage.getItem('stashOrderList'))
    localStorage.setItem(
      'stashOrderList',
      stashOrderList
        ? JSON.stringify([...stashOrderList, ordersStore.ordersList])
        : JSON.stringify([ordersStore.ordersList]),
    )

    ordersStore.resetOrderList()
  }

  function resetCart() {
    ordersStore.ordersList.items.length = 0
    ordersStore.ordersList.note = null
  }

  return {
    resetCart,
    display,
    tabActiveId,
    submitList,
    setScheduleDateDone,
    cancelScheduleDateNTime,
    showScheduleDialog,
    rules,
    activeProductItems,
    activeProducts,
    dialog,
    computedDialog,
    ordersStore,
    productsStore,
    markerStore,
    parseDate,
    schedule,
    cancelSettingDateAndTime,
    stashOrderList,
  }
}
