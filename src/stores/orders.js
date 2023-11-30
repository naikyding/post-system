import { ref, reactive, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  createOrderAPI,
  getOrderListAPI,
  deleteOrderAPI,
  deleteOrderItemAPI,
  updateOrderAPI,
  updateOrderItemAPI,
} from '@/api'
import catchAsync from '@/utils/catchAsync'
import { useUserStore } from '../stores/users'
import { useAppStore } from '../stores/app'
import { resFunc } from '../utils/resFunc'
import dayJS from 'dayjs'

export const useOrdersStore = defineStore('orders', () => {
  // 產品彈窗 dialog
  const selectorDialog = ref(false)

  // 購物車清單初始內容
  const ordersList = reactive({
    items: [],
    note: '',
    mobileNoThreeDigits: null,
    isPaid: false,

    total: computed(() => {
      return ordersList.items.reduce(
        (init, cur) => {
          init.quantity += cur.quantity
          init.subTotal += cur.total
          init.totalPrice += cur.total + init.service + init.discount

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
    ordersList.mobileNoThreeDigits = null
  }

  // 當前產品項目加入購物車
  function addActiveProductItemToOrdersList(productItem, ordersList, dialog) {
    if (productItem.editMode.status) {
      ordersList.items = ordersList.items.filter(
        (orderItem) => orderItem !== productItem.editMode.orderItem,
      )
    }

    const { matchProductItem, quantity } = sameProductItemIncludeOrdersList(ordersList, productItem)

    if (matchProductItem) {
      orderItemQuantityPlusOrMinus('plus', ordersList, matchProductItem, quantity)
    } else {
      ordersList.items.push({
        product: productItem.product,
        extras: productItem.form.extras,
        quantity: productItem.quantity,
        notes: productItem.notes,
        markers: productItem.markers,
        total: productItem.price,
      })
    }
    dialog.activeProductItem = false
    resetActiveProductItem()
  }

  // 快速將 當前選擇產品項目 加入 購物車
  async function fashAddActiveProductItemToOrdersList(ordersList, productItem, dialog, bagId) {
    await selectedProduct(productItem, dialog, false)

    if (bagId) {
      // 產品是否有袋子
      const bagExtrasIncludes = productItem.extras
        .find((extrasItem) => extrasItem.type === '加購')
        .items.find((item) => item._id === bagId)

      if (bagExtrasIncludes)
        activeProductItem.form.extras = [
          {
            extraItem: bagExtrasIncludes,
            quantity: 1,
            price: bagExtrasIncludes.price * 1,
          },
        ]
    }

    await addActiveProductItemToOrdersList(activeProductItem, ordersList, dialog)
  }

  // 點單項目是否存在清單中 (for 當前產品項目加入購物車)
  function sameProductItemIncludeOrdersList(ordersList, productItem) {
    const quantity = productItem.quantity || 1

    const matchProductItem = ordersList.items.find((orderItem) => {
      // 無 extras
      const orderExtrasLength = orderItem.extras.length
      const productExtrasLength = productItem.form.extras.length
      const sameProductId = orderItem.product._id === productItem.product._id

      if (orderExtrasLength < 1 && productExtrasLength < 1 && sameProductId) return true

      if (sameProductId && productExtrasLength !== 0) {
        let matchExtrasNum = 0
        productItem.form.extras.forEach((productItemExtraItem) => {
          orderItem.extras.forEach((orderItemExtraItem) => {
            if (orderItemExtraItem.extraItem._id === productItemExtraItem.extraItem._id)
              matchExtrasNum++
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

    return {
      matchProductItem,
      quantity,
    }
  }

  // 點擊產品功能
  function selectedProduct(productItem, dialog, dialogStatus) {
    activeProductItem.product = productItem
    activeProductItem.extrasTypeOpen = productItem.extras.map((item) => item.type) || []
    dialog.activeProductItem = dialogStatus
  }

  // 編輯訂單項目
  function editOrderItem(orderList, orderItem, dialog, dialogStatus) {
    activeProductItem.editMode.status = true
    activeProductItem.editMode.orderItem = orderItem

    activeProductItem.form.extras = orderItem.extras
    activeProductItem.notes = orderItem.notes
    activeProductItem.markers = orderItem.markers
    activeProductItem.quantity = orderItem.quantity
    selectedProduct(orderItem.product, dialog, dialogStatus)
  }

  // 當前選擇產品項目
  const activeProductItem = reactive({
    form: {
      extras: [],
    },

    extrasTypeOpen: [],
    editMode: {
      status: false,
      orderItem: null,
    },

    notes: '',
    markers: [],
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

  function operationExtrasQuantity(type, form, extraItem) {
    const matchExtraItem = form.extras.find((item) => item.extraItem._id === extraItem._id)
    if (type === 'minus' && matchExtraItem.quantity === 1) {
      return (form.extras = form.extras.filter((item) => item !== matchExtraItem))
    }
    if (!matchExtraItem && type === 'plus') {
      form.extras = [
        ...form.extras,
        {
          extraItem: extraItem,
          quantity: 1,
          price: extraItem.price,
        },
      ]
      return
    }

    if (type === 'plus') matchExtraItem.quantity = matchExtraItem.quantity + 1
    else matchExtraItem.quantity = matchExtraItem.quantity - 1

    matchExtraItem.price = extraItem.price * matchExtraItem.quantity
  }

  // (重置) 當前選擇產品項目
  function resetActiveProductItem() {
    activeProductItem.form.extras = []
    activeProductItem.quantity = 1
    activeProductItem.product = {}
    activeProductItem.notes = ''
    activeProductItem.markers = []

    activeProductItem.editMode.status = false
    activeProductItem.editMode.orderItem = null
  }

  // 選單項目數量 增/減 功能
  function orderItemQuantityPlusOrMinus(type, orderList, orderItem, num) {
    const plus = type === 'plus'

    // 移除項目
    if (!plus && orderItem.quantity === 1) {
      orderList.items = orderList.items.filter((item) => item !== orderItem)

      return
    }
    const itemPrice = orderItem.total / orderItem.quantity

    if (plus) num ? (orderItem.quantity += num) : orderItem.quantity++
    else orderItem.quantity--

    orderItem.total = itemPrice * orderItem.quantity
  }

  // 當前選擇產品項目 (dialog) 加減數量
  function activeProductItemQuantity(plusType) {
    if (plusType) {
      return activeProductItem.quantity++
    }
    if (activeProductItem.quantity < 2) return false
    activeProductItem.quantity--
  }

  // 送出訂單
  const submitOrderList = catchAsync(async ({ list, isPaid, dialog, paymentType }) => {
    list.isPaid = isPaid
    list.paymentType = paymentType

    const userStore = useUserStore()
    const appStore = useAppStore()

    const formatData = list.items.reduce(
      (init, cur) => {
        const curMarkers = cur.markers.map((item) => item._id)
        const curExtrasAry = cur.extras.reduce((initExtra, curExtra) => {
          return (initExtra = [
            ...initExtra,
            {
              extraItem: curExtra.extraItem._id,
              quantity: curExtra.quantity,
              price: curExtra.price,
            },
          ])
        }, [])

        init.items.push({
          product: cur.product._id,
          extrasData: curExtrasAry,
          quantity: cur.quantity,
          price: cur.total,
          notes: cur.notes,
          markers: curMarkers,
        })

        if (!init.note) init.note = list.note
        if (!init.mobileNoThreeDigits) init.mobileNoThreeDigits = list.mobileNoThreeDigits
        if (!init.isPaid) init.isPaid = list.isPaid || false
        if (!init.paymentType) init.paymentType = list.paymentType || 'cash'
        if (!init.totalPrice) init.totalPrice = list.total.totalPrice

        return init
      },
      {
        items: [],
      },
    )

    formatData.customer =
      userStore.roles.name === 'admin' ? userStore.adminCustomer : userStore.baseInfo._id
    formatData.agent = userStore.agents

    dialog.confirmOrderList = false

    const { status } = await createOrderAPI(formatData)
    appStore.resStatusDialog({ status: status, text: '新增訂單' })
    resFunc(status, () => {
      resetOrderList()
      const systemOrderListStore = useSystemOrderList()
      systemOrderListStore.getOrderList('today')
    })
  })

  return {
    ordersList,
    addActiveProductItemToOrdersList,

    fashAddActiveProductItemToOrdersList,
    operationExtrasQuantity,

    activeProductItemQuantity,
    resetActiveProductItem,
    activeProductItem,
    selectedProduct,
    editOrderItem,
    selectorDialog,
    submitOrderList,

    orderItemQuantityPlusOrMinus,
  }
})

export const useSystemOrderList = defineStore('systemOrder', () => {
  const activeListTab = ref('pending')
  const pendingQuantity = ref(0)
  const activeListDate = reactive({
    from: null,
    to: null,
  })

  const selectDate = reactive([
    {
      name: '今日',
      range: 'day',
    },
    {
      name: '昨日',
      range: 'yesterday',
    },
    {
      name: '週',
      range: 'week',
    },
    {
      name: '月',
      range: 'month',
    },
    {
      name: '季',
      range: 'quarter',
    },
    {
      name: '年',
      range: 'year',
    },
  ])

  const activeRange = ref('day')

  const orderList = ref([])
  const activeOrderList = ref([])

  function addActiveOrderList(order) {
    activeOrderList.value = order
  }

  function getOrderListFilter(activeTab) {
    let urlQueryString = '?limit=0&offset=0'
    if (localStorage.getItem('agentsId'))
      urlQueryString += `&agent=${localStorage.getItem('agentsId')}`
    if (activeListDate.from && activeListDate.to)
      urlQueryString += `&from=${activeListDate.from}&to=${activeListDate.to}`

    if (!activeTab) return (urlQueryString += '&paid=false')
    if (activeTab === 'all') return urlQueryString

    return (urlQueryString += `&status=${activeTab}`)
  }

  function initTodayAndTab() {
    const now = dayJS(new Date()).format('YYYY-MM-DD')
    activeListDate.from = now
    activeListDate.to = now
    activeListTab.value = 'pending'
  }

  const getOrderList = catchAsync(
    async (type) => {
      if (type === 'today') initTodayAndTab()

      orderList.value.length = 0
      const { data } = await getOrderListAPI(getOrderListFilter(activeListTab.value))
      if (type !== 'getPendingQuantity') {
        orderList.value = data.items
      }
      if (activeListTab.value === 'pending') {
        pendingQuantity.value = 0
        pendingQuantity.value = data.items.reduce((init, cur) => {
          return (init += cur.items.reduce((init, cur) => {
            if (cur.product && cur.product.type === '塑膠提袋') return init
            return (init += cur.quantity)
          }, 0))
        }, 0)
      }
    },
    () => {
      console.log('getOrderList Error')
    },
  )

  const getOrderListFromSystem = catchAsync(async (activeDate) => {
    if (activeRange.value === 'day') initTodayAndTab()

    // ?status=pending&from=2023-06-18&to=2023-06-19
    orderList.value.length = 0

    const { from, to } = activeDate
    let requestParamsString = `?from=${from}&to=${to}`

    localStorage.getItem('agentsId') &&
      (requestParamsString += `&agent=${localStorage.getItem('agentsId')}`)

    console.log(`requestParamsString`, requestParamsString)
    const { data } = await getOrderListAPI(requestParamsString)
    orderList.value = data.items
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

  const dashboardDataStep1 = computed(() => {
    let initData = {
      revenue: '--',
      visitors: '--',
      averageOrderValue: '--',
      quantity: '--',
    }

    if (orderList.value.length < 1) return initData

    return orderList.value.reduce((init, cur) => {
      if (cur.status === 'cancelled') return init

      init.visitors === '--' ? (init.visitors = 1) : (init.visitors += 1)
      init.revenue === '--' ? (init.revenue = cur.totalPrice) : (init.revenue += cur.totalPrice)
      init.averageOrderValue =
        init.revenue === '--' || init.visitors === '--' ? '--' : init.revenue / init.visitors

      const quantityTotal = cur.items.reduce((init, cur) => {
        if (cur.product && cur.product.type === '塑膠提袋') return init
        return (init += cur.quantity)
      }, 0)

      init.quantity === '--' ? (init.quantity = quantityTotal) : (init.quantity += quantityTotal)
      return init
    }, initData)
  })

  const updateOrderProductItem = catchAsync(async (data) => {
    const { status } = await updateOrderItemAPI(data)

    resFunc(status, () => {
      const appStore = useAppStore()
      appStore.resStatusDialog({ status: status, text: '更新成功' })
      getOrderList()
      return true
    })

    return status
  })

  return {
    getOrderList,
    orderList,

    updateOrderList,
    updateOrderContent,
    updateOrderProductItem,

    addActiveOrderList,
    activeOrderList,

    deleteOrderById,
    deleteOrderItemById,
    activeListTab,
    activeListDate,
    pendingQuantity,

    selectDate,
    activeRange,
    getOrderListFromSystem,
    dashboardDataStep1,
  }
})
