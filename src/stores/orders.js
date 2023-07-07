import { ref, reactive, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  createOrderAPI,
  getOrderListAPI,
  deleteOrderAPI,
  deleteOrderItemAPI,
  updateOrderAPI,
} from '@/api'
import catchAsync from '@/utils/catchAsync'
import { useUerStore } from '../stores/users'
import { useAppStore } from '../stores/app'
import { resFunc } from '../utils/resFunc'
import dayJS from 'dayjs'
import { successErrorFunc } from '../utils/resFunc'

export const useOrdersStore = defineStore('orders', () => {
  // 產品彈窗 dialog
  const selectorDialog = ref(false)

  // 購物車清單初始內容
  const ordersList = reactive({
    items: [],
    note: '',
    isPaid: false,

    total: computed(() => {
      return ordersList.items.reduce(
        (init, cur) => {
          init.quantity += cur.quantity
          init.subTotal += cur.total
          init.totalPrice += cur.total * cur.quantity + init.service + init.discount

          return init
        },
        {
          quantity: 0,
          subTotal: 0,
          service: 0, // 服務費
          discount: 0, // 優惠費
          totalPrice: 0,
        },
      )
    }),
  })

  function resetOrderList() {
    ordersList.items = []
    ordersList.note = ''
    ordersList.isPaid = false
  }

  // 刪除購物車指定項目
  function dropOrdersListItemByIndex(list, index) {
    list.items = list.items.filter((item, itemIndex) => itemIndex !== index)
  }

  // 當前產品項目加入購物車
  function addActiveProductItemToOrdersList(productItem, ordersList, dialog) {
    const matchProductItem = sameProductItemIncludeOrdersList(ordersList, productItem)

    if (matchProductItem) {
      matchProductItem.quantity++
    } else {
      ordersList.items.push({
        product: productItem.product,
        extras: productItem.form.extras,
        quantity: productItem.quantity,
        total: productItem.price,
      })
    }

    dialog.activeProductItem = false
  }

  // 快速將 當前選擇產品項目 加入 購物車
  async function fashAddActiveProductItemToOrdersList(ordersList, productItem, dialog) {
    await selectedProduct(productItem, dialog, false)
    await addActiveProductItemToOrdersList(activeProductItem, ordersList, dialog)
  }

  // 點單項目是否存在清單中 (for 當前產品項目加入購物車)
  function sameProductItemIncludeOrdersList(ordersList, productItem) {
    return ordersList.items.find((orderItem) => {
      // 無 extras
      const orderExtrasLength = orderItem.extras.length
      const productExtrasLength = productItem.form.extras.length
      const sameProductId = orderItem.product._id === productItem.product._id

      if (orderExtrasLength < 1 && productExtrasLength < 1 && sameProductId) return true

      if (sameProductId && productExtrasLength !== 0) {
        let matchExtrasNum = 0
        productItem.form.extras.forEach((productItemExtraItem) => {
          orderItem.extras.forEach((orderItemExtraItem) => {
            if (orderItemExtraItem._id === productItemExtraItem._id) matchExtrasNum++
          })
        })

        if (
          productExtrasLength === matchExtrasNum &&
          orderExtrasLength === matchExtrasNum &&
          productExtrasLength === orderExtrasLength
        )
          return true
      }
    })
  }

  // 點擊產品功能
  function selectedProduct(productItem, dialog, dialogStatus) {
    activeProductItem.product = productItem
    dialog.activeProductItem = dialogStatus
  }

  // 當前選擇產品項目
  const activeProductItem = reactive({
    form: {
      extras: [],
    },

    product: {},
    quantity: 1,
    price: computed(() => {
      const totalExtrasPrice = activeProductItem.form.extras.reduce((init, cur) => {
        return (init += cur.price)
      }, 0)

      return activeProductItem.product.price
        ? (totalExtrasPrice + activeProductItem.product.price) * activeProductItem.quantity
        : 0
    }),
  })

  // (重置) 當前選擇產品項目
  function resetActiveProductItem() {
    activeProductItem.form.extras = []
    activeProductItem.quantity = 1
    activeProductItem.product = {}
  }

  // 當前選擇產品項目 (dialog) 加減數量
  function activeProductItemQuantity(plusType) {
    if (plusType) {
      if (activeProductItem.quantity > 4) return false
      return activeProductItem.quantity++
    }
    if (activeProductItem.quantity < 2) return false
    activeProductItem.quantity--
  }

  // 送出訂單
  const submitOrderList = catchAsync(async ({ list, isPaid, dialog }) => {
    list.isPaid = isPaid
    const userStore = useUerStore()
    const appStore = useAppStore()

    const formatData = list.items.reduce(
      (init, cur) => {
        const curExtrasAry = cur.extras.reduce((initExtra, curExtra) => {
          return (initExtra = [...initExtra, curExtra._id])
        }, [])

        init.items.push({
          product: cur.product._id,
          extras: curExtrasAry,
          quantity: cur.quantity,
          price: cur.total,
        })

        if (!init.note) init.note = list.note
        if (!init.isPaid) init.isPaid = list.isPaid
        if (!init.paymentType) init.paymentType = 'cash'
        if (!init.totalPrice) init.totalPrice = list.total.totalPrice

        return init
      },
      {
        items: [],
      },
    )

    formatData.customer = userStore.customer
    formatData.agent = userStore.agent

    dialog.confirmOrderList = false
    const { status } = await createOrderAPI(formatData)
    appStore.resStatusDialog({ status: status, text: '新增訂單' })
    resFunc(status, () => {
      resetOrderList()
      const systemOrderListStore = useSystemOrderList()
      systemOrderListStore.getTodayOrderList()
    })
  })

  return {
    ordersList,
    dropOrdersListItemByIndex,
    addActiveProductItemToOrdersList,
    fashAddActiveProductItemToOrdersList,
    activeProductItemQuantity,
    resetActiveProductItem,
    activeProductItem,
    selectedProduct,
    selectorDialog,
    submitOrderList,
  }
})

export const useSystemOrderList = defineStore('systemOrder', () => {
  const activeListTab = ref('pending')
  const pendingQuantity = ref(0)
  const activeListDate = reactive({
    from: null,
    to: null,
  })

  const orderList = ref([])
  const activeOrderList = ref([])

  function addActiveOrderList(order) {
    activeOrderList.value = order
  }

  function getOrderListFilter(activeTab) {
    let urlQueryString = '?limit=0&offset=0'

    if (activeListDate.from && activeListDate.to)
      urlQueryString += `&from=${activeListDate.from}&to=${activeListDate.to}`
    if (!activeTab) return (urlQueryString += '&paid=false')
    if (activeTab === 'all') return urlQueryString

    return (urlQueryString += `&status=${activeTab}`)
  }

  function getTodayOrderList() {
    const now = dayJS(new Date()).format('YYYY-MM-DD')
    activeListDate.from = now
    activeListDate.to = now
    activeListTab.value = 'pending'

    getOrderList()
  }

  const getOrderList = catchAsync(async () => {
    orderList.value.length = 0
    const { data } = await getOrderListAPI(getOrderListFilter(activeListTab.value))
    orderList.value = data.items
    if (activeListTab.value === 'pending') {
      pendingQuantity.value = 0
      pendingQuantity.value = data.items.reduce((init, cur) => {
        return (init += cur.items.length)
      }, 0)
    }
  })

  async function updateOrderList() {}

  const updateOrderContent = catchAsync(
    // 成功執行
    async (orderId, updateData) => {
      const appStore = useAppStore()
      const { status } = await updateOrderAPI(orderId, updateData)
      appStore.resStatusDialog({ status: status, text: '已更新訂單內容' })
      if (status) getOrderList()
    },
  )

  const deleteOrderById = catchAsync(async (id) => {
    const appStore = useAppStore()
    const { status } = await deleteOrderAPI(id)
    appStore.resStatusDialog({ status: status, text: '已刪除訂單所有項目' })
    if (status) getOrderList()
  })

  const deleteOrderItemById = catchAsync(async (id) => {
    const appStore = useAppStore()
    const { status } = await deleteOrderItemAPI(id)
    appStore.resStatusDialog({ status: status, text: '已刪除指定內容' })
    if (status) getOrderList()
  })

  watch(activeListTab, getOrderList)

  return {
    getOrderList,
    orderList,

    updateOrderList,
    updateOrderContent,

    addActiveOrderList,
    activeOrderList,

    deleteOrderById,
    deleteOrderItemById,
    activeListTab,
    activeListDate,
    pendingQuantity,
    getTodayOrderList,
  }
})
