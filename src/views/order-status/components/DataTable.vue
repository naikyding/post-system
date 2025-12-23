<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useSystemOrderList } from '@/stores/orders'
import { useMarkersStore, useProductsStore } from '@/stores/products'
import { useDisplay } from 'vuetify'
import { encrypt, decrypt } from '@/utils/secret'
import { speak } from '@/utils/speechSynthesis'

import Swal from 'sweetalert2'
import EmptyBox from '@/components/EmptyBox.vue'
import dayJS from 'dayjs'
import { watch } from 'vue'
import { computed } from 'vue'
import { toRaw } from 'vue'
import { useOrdersStore } from '@/stores/orders.js'

const systemOrderStore = useSystemOrderList()
const markerStore = useMarkersStore()

const closeOrderItem = ref([])
const paymentType = ref(null)
const paymentAlertSnackbar = ref(false)
const editSheetStatus = ref(false)
const editOrderForm = ref({})

function formatSpeak(mobile) {
  return `` + mobile.split('').join(' ') + '，，您的可麗餅好囉!'
}

const optionExtras = ref({
  dialog: false,
  list: [],
  activeItem: null,
})

function extrasMinusAndPlus(type, extras) {
  if (type === 'plus') {
    extras.quantity++
  } else {
    if (extras.quantity < 1) return false
    extras.quantity--
  }
  computedOptionExtras(extras)
}

watch(
  () => optionExtras.value.dialog,
  (status) => {
    if (!status) {
      optionExtras.value.list = []
      optionExtras.value.activeItem = null
    }
  },
)

const computedDialog = reactive({
  status: false,
  deposit: 0,
  computedNumber: computed(() =>
    computedDialog.deposit > systemOrderStore.activeOrderList.totalPrice
      ? computedDialog.deposit - systemOrderStore.activeOrderList.totalPrice
      : '--',
  ),
})

watch(
  () => computedDialog.status,
  (newValue) => {
    if (!newValue) computedDialog.deposit = 0
  },
)

function optionExtraSave(optionExtra) {
  optionExtras.value.dialog = false

  const matchItem = editOrderForm.value.items.find(
    (item) => item._id === optionExtras.value.activeItem,
  )

  matchItem.extrasData = [
    ...optionExtra.reduce((acc, cur) => {
      if (cur.quantity > 0) return (acc = [...acc, cur])
      else return acc
    }, []),
  ]
  matchItem.price = computedOrderItemPrice(editOrderForm.value, matchItem._id)
  editOrderForm.value.totalPrice = computedOrderListPrice(editOrderForm.value)
}

function computedOptionExtras(extraItem) {
  extraItem.price = extraItem.quantity * extraItem.extraItem.price
}

function showCurrentProductSExtrasData(list, item) {
  optionExtras.value.list = []
  optionExtras.value.activeItem = null

  optionExtras.value.activeItem = item._id
  optionExtras.value.dialog = true
  optionExtras.value.list = item.product.extras.reduce((acc, cur) => {
    const matchItem = item.extrasData.find((item) => item.extraItem._id === cur._id)

    return (acc = [
      ...acc,
      {
        _id: cur._id,
        extraItem: cur,
        price: matchItem ? matchItem.price : 0,
        quantity: matchItem ? matchItem.quantity : 0,
      },
    ])
  }, [])
}

function formatOrderForm(form) {
  const cloneForm = JSON.parse(JSON.stringify(form))

  cloneForm.items = cloneForm.items.map((item) => {
    item.product = item.product._id
    item.markers = item.markers.reduce((acc, cur) => {
      return (acc = [...acc, cur._id])
    }, [])
    delete item.extras
    item.extrasData = item.extrasData.reduce((acc, cur) => {
      return (acc = [
        ...acc,
        {
          extraItem: cur.extraItem._id,
          quantity: cur.quantity,
          price: cur.price,
        },
      ])
    }, [])
    return item
  })

  return cloneForm
}

async function submitEditForm(form) {
  await systemOrderStore.updateOrderContent(form._id, formatOrderForm(form))

  editSheetStatus.value = false
  preSaveEditOrderDialog.value = false
  dialog.confirmOrderList = false
}

function initEditForm(editForm, activeOrderContent) {
  const index = [
    '_id',
    'status',
    'note',
    'mobileNoThreeDigits',
    'isPaid',
    'paymentType',
    'totalPrice',
    'items',
  ]
  index.forEach((key) => {
    // 深度拷貝 (代理物件要成原物件)
    editForm.value[key] = structuredClone(toRaw(activeOrderContent[key]))
  })
}

const productsStore = useProductsStore()
const tabActiveId = ref(0)
const addProduct = ref({
  dialog: false,
})

function showProductListDialog() {
  addProduct.value.dialog = true
}
function addProductItemInOrder(orderList, item) {
  const cloneItem = JSON.parse(JSON.stringify(item))
  cloneItem.extras = cloneItem.extras.reduce((acc, cur) => {
    return (acc = [...acc, ...cur.items])
  }, [])

  orderList.items.push({
    product: cloneItem,
    extrasData: [],
    markers: [],
    notes: '',
    price: cloneItem.price,
    quantity: 1,
    status: false,
  })
  orderList.totalPrice = computedOrderListPrice(orderList)
  addProduct.value.dialog = false
}

const preSaveEditOrderDialog = ref(false)

function editOrderList() {
  initEditForm(editOrderForm, systemOrderStore.activeOrderList)
  editSheetStatus.value = true
}

function editOrderListItemQuantityFun(editOrderForm, editOrderFormItem, payload) {
  // 單價
  const itemPrice = editOrderFormItem.price / editOrderFormItem.quantity

  editOrderFormItem.quantity = editOrderFormItem.quantity + payload
  if (editOrderFormItem.quantity < 1) {
    editOrderForm.items = editOrderForm.items.filter((item) => item._id !== editOrderFormItem._id)
  }
  editOrderFormItem.price = itemPrice * editOrderFormItem.quantity

  editOrderForm.totalPrice = computedOrderListPrice(editOrderForm)
}

function computedOrderItemPrice(orderList, itemId) {
  const item = orderList.items.find((item) => item._id === itemId)

  const computedExtraTotal = item.extrasData.reduce((acc, cur) => {
    return (acc += cur.price)
  }, 0)

  return (computedExtraTotal + item.product.price) * item.quantity
}

function computedOrderListPrice(orderList) {
  return orderList.items.reduce((acc, cur) => {
    return (acc += cur.price)
  }, 0)
}

function editOrderListItemExtraQuantityFun(editOrderForm, orderItemId, extraItemId, payload) {
  const orderItem = editOrderForm.items.find((item) => item._id === orderItemId)
  const extraItem = orderItem.extrasData.find((item) => item._id === extraItemId)

  // 單價
  const extraItemPrice = extraItem.extraItem.price

  extraItem.quantity = extraItem.quantity + payload

  if (extraItem.quantity < 1) {
    orderItem.extrasData = orderItem.extrasData.filter((item) => item._id !== extraItemId)
  }

  extraItem.price = extraItem.quantity * extraItemPrice
  orderItem.price = computedOrderItemPrice(editOrderForm, orderItemId)
  editOrderForm.totalPrice = computedOrderListPrice(editOrderForm)
}

function initCloseItemData() {
  const closeOrderItemFromSession = sessionStorage.getItem('closeOrderItem')

  if (closeOrderItemFromSession) {
    const sessionStorageData = decrypt(closeOrderItemFromSession).split(',')
    closeOrderItem.value = sessionStorageData
  }
}

onMounted(() => {
  initCloseItemData()
  markerStore.getMarkers()
  productsStore.getProducts()
})

const divider = { type: 'divider' }

const computedOrderItems = computed(() =>
  editOrderForm.value.items.reduce((acc, cur) => {
    return (acc = [...acc, cur, divider])
  }, []),
)

// 記錄收折訂單
function toggleOrderItem(id) {
  const itemIncludes = closeOrderItem.value.includes(id)

  if (itemIncludes) closeOrderItem.value = closeOrderItem.value.filter((item) => item !== id)
  else closeOrderItem.value = [...closeOrderItem.value, id]

  closeOrderItem.value.length > 0
    ? sessionStorage.setItem('closeOrderItem', encrypt(closeOrderItem.value.toString()))
    : sessionStorage.removeItem('closeOrderItem')

  dialog.confirmOrderList = false
}

const dialog = reactive({
  confirmOrderList: false,
})

watch(
  () => dialog.confirmOrderList,
  (status) => {
    if (!status) {
      // 詳細商品視窗關閉
      paymentType.value = null
      systemOrderStore.addActiveOrderList({})
    }
  },
)

const display = useDisplay()

const confirmEditOrderDialog = reactive({
  type: null,
  status: false,
})

function showOrderListDetails(order) {
  systemOrderStore.addActiveOrderList(order)
  dialog.confirmOrderList = true
}

async function deleteDialog(orderListID, updateData, callback) {
  dialog.confirmOrderList = false

  const { isConfirmed } = await Swal.fire({
    title: '確定取消訂單?',
    showCancelButton: true,
    confirmButtonText: '確定，取消訂單',
    confirmButtonColor: '#dc3741',
    cancelButtonText: '取消',
  })

  if (isConfirmed) {
    return callback(orderListID, updateData)
  }
}

async function updateDialog(orderListID, updateData, callback) {
  // 未付款
  if (!systemOrderStore.activeOrderList.isPaid) {
    // 未選擇支付方式
    if (!paymentType.value) {
      paymentAlertSnackbar.value = true
      return false
    }
    updateData['paymentType'] = paymentType.value
  }

  dialog.confirmOrderList = false

  const { isConfirmed } = await Swal.fire({
    title: '更新訂單狀態，確認項目都完成?',
    showCancelButton: true,
    confirmButtonText: '確定',
    confirmButtonColor: '#4cae50',
    cancelButtonText: '取消',
  })

  if (isConfirmed) {
    return callback(orderListID, updateData)
  }
}

function addBag(bagExtrasId, orderItem) {
  console.log(`addBag`)
  console.log(bagExtrasId, orderItem.extras)
}

function ShowAddBagToOrderItemDialog(activeOrderItem, productItem) {
  confirmEditOrderDialog.type = 'add'
  confirmEditOrderDialog.status = true

  saveOrderListProductEditForm(activeOrderItem, productItem)
}

const saveOrderListProductEditForm = (orderItem, productItem) => {
  orderListProductEditForm.orderId = orderItem._id
  orderListProductEditForm.orderItemId = productItem._id

  orderListProductEditForm.originProductItemContent = productItem
}

const orderListProductEditForm = reactive({
  orderId: null,
  orderItemId: null,
  putExtrasContent: [],

  originOrderItemContent: {},
  originProductItemContent: {},
})

async function addBagToOrderItem(bagSizeSId) {
  const addExtrasItem = orderListProductEditForm.originProductItemContent.product.extras.find(
    (extrasId) => extrasId._id === bagSizeSId,
  )

  if (addExtrasItem) {
    if (orderListProductEditForm.originProductItemContent.extras.length < 1) {
      orderListProductEditForm.putExtrasContent.push({
        extraItem: addExtrasItem._id,
        quantity: 1,
        price: addExtrasItem.price * 1,
      })
    } else {
      orderListProductEditForm.putExtrasContent =
        orderListProductEditForm.originProductItemContent.extras.reduce((init, cur, index) => {
          init = [
            ...init,
            {
              extraItem: cur.extraItem._id,
              quantity: cur.quantity,
              price: cur.extraItem.price * cur.quantity,
            },
          ]

          if (index + 1 === orderListProductEditForm.originProductItemContent.extras.length) {
            init = [
              ...init,
              {
                extraItem: addExtrasItem._id,
                quantity: 1,
                price: addExtrasItem.price * 1,
              },
            ]
            return init
          }

          return init
        }, [])
    }

    const data = {
      orderId: orderListProductEditForm.orderId,
      itemId: orderListProductEditForm.orderItemId,
      extras: [...orderListProductEditForm.putExtrasContent],
    }

    confirmEditOrderDialog.status = false
    confirmEditOrderDialog.type = null
    dialog.confirmOrderList = false

    const res = await systemOrderStore.updateOrderProductItem(data)
    // 成功執行
    if (res) {
      orderListProductEditForm.putExtrasContent.length = 0
    }
  }
}

function isShowAddBagBtn(orderItemData) {
  const bagAry = ['64cf45d1ee6af4dc14dcb456', '64f009480b4da165c7eebddd']
  let productExtrasAry = []

  if (orderItemData.product) {
    productExtrasAry = orderItemData.product.extras
  }

  // 訂單項目是否存在袋子
  const bagInOrderItemExtras = orderItemData.extras.find((orderItemExtraItem) =>
    bagAry.includes(orderItemExtraItem.extraItem._id),
  )

  // 產品本身沒有配料
  const bagInOrderItemProductExtras = productExtrasAry.find((bagInOrderItemProductExtrasItem) =>
    bagAry.includes(bagInOrderItemProductExtrasItem._id),
  )

  if (bagInOrderItemExtras || !bagInOrderItemProductExtras) return false

  return true
}

function showRemoveBagDialog(activeOrderItem, productItem) {
  confirmEditOrderDialog.type = 'remove'
  confirmEditOrderDialog.status = true
  saveOrderListProductEditForm(activeOrderItem, productItem)
}

async function removeProductItemBagS(bagSizeId) {
  orderListProductEditForm.putExtrasContent =
    orderListProductEditForm.originProductItemContent.extras.reduce((init, cur) => {
      if (cur.extraItem._id !== bagSizeId) {
        return (init = [
          ...init,
          {
            extraItem: cur.extraItem._id,
            quantity: cur.quantity,
            price: cur.extraItem.price * cur.quantity,
          },
        ])
      } else return init
    }, [])

  const data = {
    orderId: orderListProductEditForm.orderId,
    itemId: orderListProductEditForm.orderItemId,
    extras: [...orderListProductEditForm.putExtrasContent],
  }

  confirmEditOrderDialog.status = false
  confirmEditOrderDialog.type = null
  dialog.confirmOrderList = false

  const res = await systemOrderStore.updateOrderProductItem(data)
  // 成功執行
  if (res) {
    orderListProductEditForm.putExtrasContent.length = 0
  }
}
</script>

<template>
  <!-- 沒有資料 -->
  <template v-if="systemOrderStore.orderList.length < 1">
    <EmptyBox :style="{ height: 'calc(100dvh - 146px)' }" />
  </template>

  <!-- 有資料 -->
  <template v-else>
    <v-data-table fixed-header hide-default-footer :style="{ height: 'calc(100dvh - 146px)' }">
      <thead>
        <tr class="text-caption">
          <th class="text-left min-width-128px">執行狀態</th>
          <th class="text-left">
            <span
              v-if="
                systemOrderStore.activeListTab === 'completed' ||
                systemOrderStore.activeListTab === 'cancelled'
              "
            >
              更新時間
            </span>

            <span v-else> 建立時間</span>
          </th>
          <th class="text-left">商品名稱</th>
          <th class="text-left">數量</th>
          <!-- <th class="text-left min-width-90px">付款狀態</th> -->
          <th class="text-left">末三碼</th>
          <th class="text-center">-</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="items in systemOrderStore.orderList" :key="items._id">
          <template v-if="closeOrderItem.includes(items._id)">
            <tr>
              <td>
                <v-btn
                  @click="toggleOrderItem(items._id)"
                  icon="mdi-arrow-split-horizontal"
                  density="comfortable"
                  variant="outlined"
                >
                </v-btn>
              </td>
              <td class="text-caption">
                <div class="day">
                  <span
                    v-if="
                      systemOrderStore.activeListTab === 'completed' ||
                      systemOrderStore.activeListTab === 'cancelled'
                    "
                  >
                    {{ dayJS(items.updatedAt).format('HH:mm') }}
                  </span>

                  <span v-else>
                    {{ dayJS(items.createdAt).format('HH:mm') }}
                  </span>
                </div>
              </td>
              <td>
                <!-- 動態顯示 預定時間 -->
                <component
                  :is="items.scheduledAt ? 'v-badge' : 'span'"
                  v-bind="
                    items.scheduledAt
                      ? {
                          location: 'left',
                          offsetX: -18,
                          offsetY: -10,
                          color: 'error',
                          content: dayJS(items.scheduledAt).format('MM/DD HH:mm'),
                        }
                      : {}
                  "
                >
                  <v-btn @click="toggleOrderItem(items._id)" variant="outlined">展開查看</v-btn>
                </component>

                <div class="notes">
                  <v-chip v-show="items.note" color="warning" prepend-icon="mdi-lead-pencil">
                    {{ items.note }}
                  </v-chip>
                </div>
              </td>
              <td class="text-h3">
                {{
                  items.items.reduce(
                    (acc, cur) => (acc += cur.product.type !== '塑膠提袋' ? 1 : 0),
                    0,
                  )
                }}
              </td>
              <td>
                <span class="px-2 py-1 rounded-lg bg-success text-h6 ml-2 font-italic">
                  {{ items.mobileNoThreeDigits || '--' }}
                </span>

                <!-- 支付方式 -->
                <span class="px-4 font-weight-bold text-pink" v-show="items.paymentType === null"
                  >尚未付款</span
                >
                <v-chip
                  v-show="items.paymentType"
                  class="ma-2"
                  :color="items.paymentType === 'cash' ? 'yellow' : 'success'"
                >
                  {{ items.paymentType }}
                </v-chip>
              </td>
              <!-- 操作鈕 -->
              <td class="text-center">
                <v-btn
                  @click="showOrderListDetails(items)"
                  size="x-small"
                  icon="mdi-dots-vertical"
                  variant="text"
                >
                </v-btn>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr v-for="(product, index) in items.items" :key="product?._id">
              <!-- 狀態 -->
              <td>
                <template v-if="items.status === 'cancelled'">
                  <span class="px-2 py-1 rounded-lg text-caption bg-error"> 取消 </span>
                </template>
                <template v-else-if="items.status === 'completed'">
                  <span class="px-2 py-1 rounded-lg text-caption bg-success"> 完成 </span>
                </template>
                <v-switch v-else inset hide-details color="success" v-model="product.status">
                  <template #label>
                    <span class="text-caption">
                      {{ `${product?.status ? '完成' : '待處理'}` }}
                    </span>
                  </template>
                </v-switch>
              </td>
              <!-- 時間 -->
              <td class="text-caption">
                <div class="day">
                  <span
                    v-if="
                      systemOrderStore.activeListTab === 'completed' ||
                      systemOrderStore.activeListTab === 'cancelled'
                    "
                  >
                    {{ dayJS(items.updatedAt).format('HH:mm') }}
                  </span>

                  <span v-else>
                    {{ dayJS(items.createdAt).format('HH:mm') }}
                  </span>
                </div>
              </td>
              <!-- 名稱與備註 -->
              <td class="font-weight-bold">
                <!-- 動態顯示 預定時間 -->
                <component
                  :is="items.scheduledAt ? 'v-badge' : 'span'"
                  v-bind="
                    items.scheduledAt
                      ? {
                          location: 'left',
                          offsetX: -18,
                          offsetY: -10,
                          color: 'error',
                          content: dayJS(items.scheduledAt).format('MM/DD HH:mm'),
                        }
                      : {}
                  "
                >
                  <a
                    href="javascript:;"
                    class="text-white font-weight-bold"
                    @click="showOrderListDetails(items)"
                  >
                    {{ product.product?.name }}
                  </a>
                </component>

                <!-- 加選配料 -->
                <div>
                  <v-chip
                    class="ma-1 text-subtitle-1"
                    v-for="extra in product.extras"
                    :key="extra._id"
                    color="error"
                  >
                    {{ extra.extraItem?.name || '--' }} x{{ extra.quantity }}
                  </v-chip>
                </div>

                <div class="mark">
                  <v-chip v-for="marker in product.markers" class="ma-1" :key="marker._id">
                    {{ marker.name }}
                  </v-chip>
                </div>

                <div class="notes">
                  <v-chip v-show="product.notes" color="warning" prepend-icon="mdi-lead-pencil">
                    {{ product.notes }}
                  </v-chip>
                </div>

                <!-- 備註 -->
                <div class="note">
                  <v-chip
                    v-show="items.note"
                    class="my-1"
                    prepend-icon="mdi-home-circle"
                    color="teal"
                  >
                    {{ items.note }}
                  </v-chip>
                </div>
              </td>
              <!-- 數量 -->
              <td class="text-right">
                <div class="text-h3">
                  {{ product.quantity }}
                </div>
                <span class="text-caption">
                  ({{
                    `${product.quantity}/${items.items.reduce(
                      (acc, cur) => (acc += cur.quantity),
                      0,
                    )}`
                  }})
                </span>
              </td>
              <!-- 未三碼 -->
              <td>
                <v-btn
                  @click="speak(formatSpeak(items.mobileNoThreeDigits))"
                  size="x-large"
                  density="compact"
                  color="success"
                  rounded
                >
                  <span class="text-h6 mr-2 font-italic">
                    {{ items.mobileNoThreeDigits || '--' }}
                  </span>
                  <v-icon>mdi-microphone</v-icon>
                </v-btn>

                <!-- 支付方式 -->
                <span class="px-4 font-weight-bold text-pink" v-show="items.paymentType === null"
                  >尚未付款</span
                >
                <v-chip
                  v-show="items.paymentType"
                  class="ma-2"
                  :color="items.paymentType === 'cash' ? 'yellow' : 'success'"
                >
                  {{ items.paymentType }}
                </v-chip>
              </td>
              <!-- 操作鈕 -->
              <td class="text-center">
                <v-btn
                  @click="showOrderListDetails(items)"
                  size="x-small"
                  icon="mdi-dots-vertical"
                  variant="text"
                >
                </v-btn>
              </td>
            </tr>
          </template>
          <!-- 原始 -->
          <tr v-show="false" v-for="(product, index) in items.items" :key="product?._id">
            <td>
              <template v-if="items.status === 'cancelled'">
                <span class="px-2 py-1 rounded-lg text-caption bg-error"> 取消 </span>
              </template>
              <template v-else-if="items.status === 'completed'">
                <span class="px-2 py-1 rounded-lg text-caption bg-success"> 完成 </span>
              </template>
              <v-switch v-else inset hide-details color="success" v-model="product.status">
                <template #label>
                  <span class="text-caption">
                    {{ `${product?.status ? '完成' : '待處理'}` }}
                  </span>
                </template>
              </v-switch>
            </td>

            <td class="text-caption">
              <div class="day">
                <span
                  v-if="
                    systemOrderStore.activeListTab === 'completed' ||
                    systemOrderStore.activeListTab === 'cancelled'
                  "
                >
                  {{ dayJS(items.updatedAt).format('HH:mm') }}
                </span>

                <span v-else>
                  {{ dayJS(items.createdAt).format('HH:mm') }}
                </span>
              </div>
            </td>
            <td class="font-weight-bold">
              <a
                href="javascript:;"
                class="text-white font-weight-bold"
                @click="showOrderListDetails(items)"
              >
                {{ product.product?.name }}
              </a>

              <!-- 加選配料 -->
              <div>
                <v-chip
                  class="ma-1 text-subtitle-1"
                  v-for="extra in product.extras"
                  :key="extra._id"
                  color="error"
                >
                  {{ extra.extraItem?.name || '--' }} x{{ extra.quantity }}
                </v-chip>
              </div>

              <div class="mark">
                <v-chip v-for="marker in product.markers" class="ma-1" :key="marker._id">
                  {{ marker.name }}
                </v-chip>
              </div>

              <div class="notes">
                <v-chip v-show="product.notes" color="warning" prepend-icon="mdi-lead-pencil">
                  {{ product.notes }}
                </v-chip>
              </div>

              <!-- 備註 -->
              <div class="note">
                <v-chip
                  v-show="items.note"
                  class="my-1"
                  prepend-icon="mdi-home-circle"
                  color="teal"
                >
                  {{ items.note }}
                </v-chip>
              </div>
            </td>
            <td class="text-right">
              <div class="text-h3">
                {{ product.quantity }}
              </div>
              <span class="text-caption">
                ({{
                  `${product.quantity}/${items.items.reduce(
                    (acc, cur) => (acc += cur.quantity),
                    0,
                  )}`
                }})
              </span>
            </td>
            <td>
              <span class="px-2 py-1 rounded-lg bg-success text-h6 ml-2 font-italic">
                {{ items.mobileNoThreeDigits || '--' }}
              </span>

              <!-- 支付方式 -->
              <span class="px-4 font-weight-bold text-pink" v-show="items.paymentType === null"
                >尚未付款</span
              >
              <v-chip
                v-show="items.paymentType"
                class="ma-2"
                :color="items.paymentType === 'cash' ? 'yellow' : 'success'"
              >
                {{ items.paymentType }}
              </v-chip>
            </td>

            <td class="text-center">
              <v-btn
                @click="showOrderListDetails(items)"
                size="x-small"
                icon="mdi-dots-vertical"
                variant="text"
              >
              </v-btn>
            </td>
          </tr>
        </template>
      </tbody>
    </v-data-table>
  </template>

  <!-- confirm Dialog -->
  <v-dialog
    transition="dialog-bottom-transition"
    v-model="dialog.confirmOrderList"
    :width="display.xs.value ? null : 640"
    :fullscreen="display.xs.value"
    scrollable
  >
    <v-card v-if="Object.keys(systemOrderStore.activeOrderList).length > 0" class="">
      <v-card-item class="text-primary text-center pb-2" title="訂單明細">
        <v-btn class="close-btn" @click="dialog.confirmOrderList = !dialog.confirmOrderList" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <div class="px-4 mt-2">
          <v-btn color="grey" class="text-white" rounded="xl" variant="tonal" block>
            未三碼
            <span class="text-h6 ml-2 font-italic text-white">
              {{ systemOrderStore.activeOrderList.mobileNoThreeDigits || '--' }}
            </span>
          </v-btn>
        </div>
      </v-card-item>

      <v-card-text>
        <div class="order-list-area">
          <div
            v-for="orderItem in systemOrderStore.activeOrderList.items"
            :key="orderItem.product?._id"
            class="order-item d-flex align-center"
          >
            <!-- 加購提袋 如果訂單項目不存在 || 產品有這個配料 -->
            <v-btn
              v-show="isShowAddBagBtn(orderItem)"
              @click="ShowAddBagToOrderItemDialog(systemOrderStore.activeOrderList, orderItem)"
              icon="mdi-medical-bag"
              color="warning"
              size="x-small"
              class="mr-2"
            >
            </v-btn>

            <div class="order-item_name font-weight-bold">
              <span>
                {{ orderItem.product?.name }}
              </span>
              <span class="text-caption"> ${{ orderItem.product?.price }} </span>
              <div
                v-for="extraItem in orderItem.extras"
                :key="extraItem._id"
                class="text-caption d-flex align-center"
              >
                <v-icon icon="mdi-plus-circle" class="mr-1" />
                <span> {{ extraItem.extraItem.name }} x{{ extraItem.quantity }} </span>
                <span> (${{ extraItem.price }})</span>

                <!-- 移除加購的提袋 -->
                <v-btn
                  @click="showRemoveBagDialog(systemOrderStore.activeOrderList, orderItem)"
                  v-show="extraItem.extraItem._id === '64cf45d1ee6af4dc14dcb456'"
                  icon="mdi-delete-outline"
                  density="compact"
                  color="error"
                  class="ml-1"
                ></v-btn>
              </div>

              <div class="mark">
                <v-chip v-for="marker in orderItem.markers" class="ma-1" :key="marker._id">
                  {{ marker.name }}
                </v-chip>
              </div>

              <div class="notes">
                <v-chip v-show="orderItem.notes" color="warning" prepend-icon="mdi-lead-pencil">
                  {{ orderItem.notes }}
                </v-chip>
              </div>
            </div>

            <v-spacer></v-spacer>

            <div class="order-item_quantity mr-3">x{{ orderItem.quantity }}</div>
            <div class="order-item_total-price text-left">
              <span class="font-weight-bold"> ${{ orderItem.price }} </span>
            </div>
          </div>

          <v-row v-show="false" class="mt-2">
            <v-col cols="6">
              <!-- 加購 -->
              <v-btn
                @click="addBag('64cf45d1ee6af4dc14dcb456', systemOrderStore.activeOrderList)"
                height="56"
                block
                rounded="lg"
                variant="flat"
                color="warning"
              >
                <div class="d-flex justify-center align-center">
                  <v-icon icon="mdi-plus" />
                  S
                </div>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <!-- 加購 -->
              <v-btn
                @click="addBag('64f009480b4da165c7eebddd', systemOrderStore.activeOrderList)"
                height="56"
                block
                rounded="lg"
                variant="flat"
                color="warning"
              >
                <div class="d-flex justify-center align-center">
                  <v-icon icon="mdi-plus" />
                  L
                </div>
              </v-btn>
            </v-col>
          </v-row>

          <div class="order-list-total d-flex my-4 font-weight-bold">
            <div class="order-list-total__items">
              共
              {{
                systemOrderStore.activeOrderList.items.reduce((init, cur) => {
                  return init + cur.quantity
                }, 0)
              }}
              項
            </div>
            <v-spacer></v-spacer>
            <div class="order-list-total__total">
              <v-btn variant="outlined" @click="computedDialog.status = true">
                總計 {{ systemOrderStore.activeOrderList.totalPrice }} 元
              </v-btn>
            </div>
          </div>
          <!-- 計算 -->
          <v-dialog v-model="computedDialog.status" width="280">
            <v-card>
              <v-card-title>計算</v-card-title>
              <v-card-text>
                <div>
                  <v-text-field
                    autofocus
                    v-model.number="computedDialog.deposit"
                    type="tel"
                    clearable
                    label="收入金額"
                    variant="outlined"
                  ></v-text-field>
                </div>
                <div>
                  訂單總金額
                  <span class="font-weight-bold text-primary font-italic">
                    {{ systemOrderStore.activeOrderList.totalPrice }}
                  </span>
                </div>
                <div class="text-h6 text-primary mt-2">
                  找零
                  <span class="text-h5 font-italic font-weight-bold">
                    {{ computedDialog.computedNumber }}
                  </span>
                </div>
              </v-card-text>
              <v-card-actions class="px-6 pb-4">
                <v-btn block color="error" variant="tonal" @click="computedDialog.status = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-alert
            v-show="!systemOrderStore.activeOrderList.isPaid"
            type="warning"
            title="未付款"
            text="此訂單，目前尚未付款完成，請確認付款後再更新訂單狀態。"
          >
            <v-row class="mt-1">
              <v-col>
                <v-btn
                  @click="paymentType = 'cash'"
                  :active="paymentType === 'cash'"
                  :prepend-icon="paymentType === 'cash' ? 'mdi-check-circle' : null"
                  block
                  size="x-large"
                  color="yellow"
                  variant="flat"
                >
                  Cash
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  @click="paymentType = 'Line Pay'"
                  :active="paymentType === 'Line Pay'"
                  :prepend-icon="paymentType === 'Line Pay' ? 'mdi-check-circle' : null"
                  block
                  size="x-large"
                  color="success"
                  variant="flat"
                >
                  Line Pay
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </div>
      </v-card-text>

      <template #actions>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="6" class="px-1">
              <!-- 修改 -->
              <v-btn
                @click="editOrderList"
                variant="outlined"
                block
                size="x-large"
                rounded="xl"
                density="comfortable"
              >
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" class="px-1">
              <!-- 縮小 -->
              <v-btn
                @click="toggleOrderItem(systemOrderStore.activeOrderList._id)"
                block
                variant="outlined"
                size="x-large"
                rounded="xl"
                density="comfortable"
              >
                <v-icon icon="mdi-arrow-collapse-vertical"></v-icon>
              </v-btn>
            </v-col>

            <!-- 完成訂單 -->
            <v-col cols="12" class="pt-0 px-1">
              <v-btn
                @click="
                  updateDialog(
                    systemOrderStore.activeOrderList._id,
                    {
                      status: 'completed',
                      isPaid: true,
                    },
                    systemOrderStore.updateOrderContent,
                  )
                "
                size="x-large"
                block
                variant="flat"
                color="success"
              >
                所有項目完成，更新訂單狀態
              </v-btn>
            </v-col>

            <!-- 取消訂單 -->
            <v-col cols="12" class="px-1 py-0">
              <v-btn
                size="x-large"
                @click="
                  deleteDialog(
                    systemOrderStore.activeOrderList._id,
                    {
                      status: 'cancelled',
                    },
                    systemOrderStore.updateOrderContent,
                  )
                "
                color="error"
                block
                variant="outlined"
                >取消訂單</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-card>
  </v-dialog>

  <!-- 修改訂定確認 -->
  <v-dialog v-model="confirmEditOrderDialog.status" width="300">
    <v-card>
      <v-card-text>
        <div class="text-center text-primary mb-4 text-h6 font-weight-bold">
          {{ orderListProductEditForm.originProductItemContent.product.name }}
        </div>
        確定
        <span class="text-success font-weight-bold" v-show="confirmEditOrderDialog.type === 'add'">
          增加提袋
        </span>
        <span class="text-error font-weight-bold" v-show="confirmEditOrderDialog.type === 'remove'">
          移除提袋
        </span>
        <span></span>
        嗎?
      </v-card-text>
      <v-card-actions v-show="confirmEditOrderDialog.type === 'add'" class="px-4">
        <v-btn
          @click="addBagToOrderItem('64cf45d1ee6af4dc14dcb456')"
          variant="flat"
          color="success"
          block
          >是的，新增</v-btn
        >
      </v-card-actions>
      <v-card-actions v-show="confirmEditOrderDialog.type === 'remove'" class="px-4">
        <v-btn
          @click="removeProductItemBagS('64cf45d1ee6af4dc14dcb456')"
          variant="flat"
          color="success"
          block
          >是的，移除</v-btn
        >
      </v-card-actions>
      <v-card-actions class="px-4">
        <v-btn
          variant="outlined"
          color="error"
          block
          @click="confirmEditOrderDialog.status = false"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar color="warning" vertical v-model="paymentAlertSnackbar" :timeout="2000">
    <v-icon icon="mdi-alert-circle"></v-icon> 請選擇「支付方式」
  </v-snackbar>

  <!-- 修改訂單內容 -->
  <v-bottom-sheet v-model="editSheetStatus" fullscreen>
    <v-card>
      <v-card-text>
        <v-btn block variant="tonal" color="error" @click="editSheetStatus = !editSheetStatus">
          close
        </v-btn>

        <v-container>
          <v-row :align="computedOrderItems.length < 1 ? 'center' : 'start'">
            <v-col :class="[{ 'text-center': computedOrderItems.length < 1 }, 'py-0']">
              <!-- 無商品 -->
              <v-icon v-show="computedOrderItems.length < 1" size="5rem">mdi-dropbox</v-icon>

              <!-- 有商品 -->
              <v-card
                class="my-4 pa-4"
                variant="tonal"
                v-for="orderItem in editOrderForm.items"
                :key="orderItem._id"
              >
                <v-row>
                  <v-col cols="12" sm="8">
                    <!-- 商品名稱 -->
                    <div>
                      <span class="font-weight-bold mr-1">{{ orderItem.product.name }}</span>
                      <span class="text-caption">${{ orderItem.product.price }}</span>
                    </div>
                    <!-- 配料區 -->
                    <div class="extras">
                      <!-- 已選配料 -->
                      <div
                        class="text-caption d-flex align-center my-2"
                        v-for="extra in orderItem.extrasData"
                        :key="extra._id"
                      >
                        <div class="mr-2">
                          <span>
                            {{ extra.extraItem.name }}
                          </span>
                          $<span class="font-weight-bold">{{ extra.extraItem.price }}</span>
                        </div>

                        <div class="d-flex align-center bg-surface-variant rounded-pill px-1 mr-2">
                          <v-btn
                            flat
                            @click="
                              editOrderListItemExtraQuantityFun(
                                editOrderForm,
                                orderItem._id,
                                extra._id,
                                -1,
                              )
                            "
                            :icon="extra.quantity > 1 ? 'mdi-minus' : 'mdi-trash-can-outline'"
                            color="error"
                            density="compact"
                            size="small"
                          />
                          <span class="text-h6 mx-2">
                            {{ extra.quantity }}
                          </span>
                          <v-btn
                            flat
                            @click="
                              editOrderListItemExtraQuantityFun(
                                editOrderForm,
                                orderItem._id,
                                extra._id,
                                1,
                              )
                            "
                            icon="mdi-plus"
                            color="success"
                            density="compact"
                            size="small"
                          />
                        </div>
                        <div>
                          +<span class="font-weight-bold text-h6">
                            {{ extra.price }}
                          </span>
                        </div>
                      </div>

                      <!-- 加選配料 -->
                      <v-btn
                        @click="showCurrentProductSExtrasData(editOrderForm, orderItem)"
                        class="my-3"
                        color="success"
                        density="compact"
                        block
                      >
                        <v-icon>mdi-plus</v-icon>
                        配料
                      </v-btn>
                      <!-- 加選配料表 -->
                      <v-dialog v-model="optionExtras.dialog" width="600" scrollable>
                        <v-card title="更新配料">
                          <v-card-text style="height: 600px">
                            <v-container fluid>
                              <v-row dense>
                                <v-col
                                  :cols="6"
                                  sm="4"
                                  v-for="extra in optionExtras.list"
                                  :key="extra._id"
                                >
                                  <v-btn block variant="flat" color="primary" height="150">
                                    <div>
                                      <div class="mb-2">
                                        <span class="">
                                          {{ extra.extraItem.name }}
                                        </span>
                                        <span class="text-caption"
                                          >${{ extra.extraItem.price }}</span
                                        >
                                      </div>
                                      <div class="d-flex justify-center align-center">
                                        <!-- 減數量 -->
                                        <v-btn
                                          @click="extrasMinusAndPlus('minus', extra)"
                                          flat
                                          icon="mdi-minus"
                                          color="error"
                                          density="compact"
                                        />

                                        <span class="text-h6 mx-2 font-weight-bold">{{
                                          extra.quantity
                                        }}</span>

                                        <!-- 加數量 -->
                                        <v-btn
                                          @click="extrasMinusAndPlus('plus', extra)"
                                          flat
                                          icon="mdi-plus"
                                          color="success"
                                          density="compact"
                                        />
                                      </div>
                                      <div>${{ extra.price }}</div>
                                    </div>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>

                          <v-card-actions>
                            <v-row class="px-4 py-2">
                              <v-col
                                ><v-btn
                                  @click="
                                    initEditForm(
                                      ref(editOrderForm),
                                      systemOrderStore.activeOrderList,
                                    )
                                  "
                                  variant="flat"
                                  size="large"
                                  text="還原"
                                  color="warning"
                                  block
                                ></v-btn
                              ></v-col>
                              <v-col>
                                <v-btn
                                  variant="flat"
                                  @click="optionExtraSave(optionExtras.list)"
                                  size="large"
                                  color="success"
                                  text="修改"
                                  block
                                ></v-btn>
                              </v-col>
                            </v-row>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>

                      <!-- 註記 -->
                      <v-select
                        hide-details
                        class="mt-6 mb-4"
                        density="compact"
                        v-model="orderItem.markers"
                        :items="markerStore.markerList"
                        chips
                        label="特製"
                        multiple
                        variant="outlined"
                        closable-chips
                        clearable
                      >
                        <template v-slot:chip="{ props, item }">
                          <v-chip
                            v-bind="props"
                            :prepend-avatar="item.raw.avatar"
                            :text="item.raw.name"
                          ></v-chip>
                        </template>
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props" :title="item?.raw?.name"></v-list-item>
                        </template>
                      </v-select>

                      <!-- 備註 -->
                      <v-textarea
                        v-model="orderItem.notes"
                        label="備註"
                        row-height="25"
                        rows="2"
                        variant="outlined"
                        auto-grow
                        shaped
                        clearable
                        hide-details
                      ></v-textarea>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4" class="d-flex align-center justify-center">
                    <div class="text-center justify-center">
                      <div class="d-flex align-center bg-surface-variant rounded-pill pa-1">
                        <v-btn
                          flat
                          @click="editOrderListItemQuantityFun(editOrderForm, orderItem, -1)"
                          :icon="orderItem.quantity > 1 ? 'mdi-minus' : 'mdi-trash-can-outline'"
                          color="error"
                          density="compact"
                          size="large"
                        />
                        <span class="text-h5 font-weight-bold mx-3">
                          {{ orderItem.quantity }}
                        </span>
                        <v-btn
                          flat
                          @click="editOrderListItemQuantityFun(editOrderForm, orderItem, 1)"
                          icon="mdi-plus"
                          color="success"
                          density="compact"
                          size="large"
                        />
                      </div>
                      <div>
                        $
                        <span class="font-weight-bold text-h6">
                          {{ orderItem.price }}
                        </span>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn @click="showProductListDialog" class="my-3" color="success" block>
                <v-icon>mdi-plus</v-icon>
                商品
              </v-btn>

              <!-- 商品列表 -->
              <v-bottom-sheet v-model="addProduct.dialog" fullscreen>
                <v-card>
                  <v-toolbar>
                    <v-btn icon="mdi-close" @click="addProduct.dialog = false"></v-btn>
                    <v-toolbar-title>挑選商品</v-toolbar-title>
                  </v-toolbar>

                  <!-- 商品列表 -->
                  <v-col
                    class="order-type bg-grey-darken-3 px-10 h-screen overflow-x-hidden overflow-y-auto"
                  >
                    <!-- TABs -->
                    <v-tabs
                      v-model="tabActiveId"
                      color="primary"
                      bg-color="grey-darken-3"
                      class="product-tabs"
                      center-active
                      show-arrows
                    >
                      <v-tab
                        v-for="(productItems, index) in productsStore.products"
                        :key="productItems + index"
                        :value="index"
                        class="text-subtitle-1"
                      >
                        {{ productItems.type }}
                      </v-tab>
                    </v-tabs>

                    <!-- 產品列表 -->
                    <v-card-text>
                      <v-window continuous v-model="tabActiveId">
                        <v-window-item
                          v-for="(productItems, index) in productsStore.products"
                          :key="productItems + index"
                          :value="index"
                        >
                          <v-container>
                            <v-row>
                              <!-- 產品項目 -->
                              <v-col
                                v-for="(productItem, index) in productItems.items"
                                :key="productItem + index"
                                cols="12"
                                sm="6"
                                md="4"
                                class="pa-1"
                              >
                                <v-card
                                  @click.stop="addProductItemInOrder(editOrderForm, productItem)"
                                >
                                  <template #title>
                                    <div class="d-flex flex-column">
                                      <div class="text-subtitle-1 font-weight-bold text-primary">
                                        {{ productItem.name }}
                                      </div>
                                      <div class="text-caption">
                                        {{ productItem.description }}
                                      </div>
                                    </div>
                                  </template>
                                  <template #text>
                                    <div>
                                      $
                                      <span class="text-h5 font-weight-bold">{{
                                        productItem.price
                                      }}</span>
                                    </div>
                                  </template>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-window-item>
                      </v-window>
                    </v-card-text>
                  </v-col>
                </v-card>
              </v-bottom-sheet>
            </v-col>

            <v-col class="sticky-t-10">
              <div>
                <!-- 手機末三碼 -->
                <v-text-field
                  v-model="editOrderForm.mobileNoThreeDigits"
                  label="手機末三碼"
                  variant="outlined"
                  clearable
                ></v-text-field>
              </div>

              <div class="mb-4">
                <!-- 支付方式 -->
                <span>支付方式</span>
                <div class="mt-1">
                  <v-btn-toggle v-model="editOrderForm.paymentType" variant="outlined" divided>
                    <v-btn size="large" selected-class="bg-warning" value="cash"> Cash</v-btn>
                    <v-btn size="large" selected-class="bg-success" value="Line Pay"
                      >Line Pay</v-btn
                    >
                  </v-btn-toggle>
                </div>
              </div>

              <div class="my-4">
                <!-- 支付狀態 -->
                <span>支付狀態</span>
                <div class="mt-1">
                  <v-btn-toggle v-model="editOrderForm.isPaid" variant="outlined" divided>
                    <v-btn size="large" selected-class="bg-error" :value="false"> 未付款 </v-btn>
                    <v-btn size="large" selected-class="bg-success" :value="true"> 已付款 </v-btn>
                  </v-btn-toggle>
                </div>
              </div>

              <div class="my-4">
                <!-- 訂單狀態 -->
                <span>訂單狀態</span>
                <div class="mt-1">
                  <v-btn-toggle v-model="editOrderForm.status" variant="outlined" divided>
                    <v-btn size="large" selected-class="bg-error" value="cancelled"> 取消 </v-btn>
                    <v-btn size="large" selected-class="bg-warning" value="pending"> 待處理 </v-btn>
                    <v-btn size="large" selected-class="bg-success" value="completed"> 完成 </v-btn>
                  </v-btn-toggle>
                </div>
              </div>

              <div>
                訂單金額 NT$
                <span class="text-h4 font-weight-bold mr-2">
                  {{ editOrderForm.totalPrice }}
                </span>
                <span
                  v-show="
                    editOrderForm.totalPrice - systemOrderStore.activeOrderList.totalPrice !== 0
                  "
                  class="text-h4 font-weight-bold"
                  :class="[
                    editOrderForm.totalPrice - systemOrderStore.activeOrderList.totalPrice > 0
                      ? 'text-success'
                      : 'text-error',
                  ]"
                  >{{
                    editOrderForm.totalPrice - systemOrderStore.activeOrderList.totalPrice > 0
                      ? '收'
                      : '退'
                  }}{{
                    editOrderForm.totalPrice - systemOrderStore.activeOrderList.totalPrice
                  }}</span
                >
              </div>

              <div class="mt-8">
                <!-- 備註 -->
                <v-textarea
                  v-model="editOrderForm.note"
                  label="備註"
                  row-height="25"
                  rows="3"
                  variant="outlined"
                  auto-grow
                  shaped
                  clearable
                ></v-textarea>
              </div>

              <v-btn
                @click="initEditForm(ref(editOrderForm), systemOrderStore.activeOrderList)"
                class="my-4"
                size="large"
                text="還原"
                color="warning"
                block
              ></v-btn>
              <v-btn
                @click="preSaveEditOrderDialog = true"
                size="large"
                color="success"
                text="保存"
                block
              ></v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>

  <!-- 修改前確認 -->
  <v-dialog v-model="preSaveEditOrderDialog" max-width="500">
    <v-card
      prepend-icon="mdi-alert-circle"
      text="修改後會影響到訂單所有內容，請確認所有資料正確!"
      title="保存修改內容"
      class="pa-3"
    >
      <template v-slot:actions>
        <v-row>
          <v-col cols="6">
            <v-btn
              @click="preSaveEditOrderDialog = false"
              size="x-large"
              variant="outlined"
              block
              color="error"
              text="取消保存"
            ></v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              @click="submitEditForm(editOrderForm)"
              size="x-large"
              variant="tonal"
              block
              color="success"
              text="確認保存"
            ></v-btn>
          </v-col>
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.order-item {
  border-bottom: solid #2e2e2e 1px;
  padding: 1rem;
}
.order-item_total-price {
  width: 50px;
}
.min-width-90px {
  min-width: 90px;
}
.min-width-128px {
  min-width: 128px;
}
.min-width-63px {
  min-width: 63px;
}

.close-btn {
  position: absolute;
  top: 4px;
  right: 1rem;
}
.sticky-t-10 {
  position: sticky;
  top: 10px;
}
.z-99 {
  z-index: 99;
}
</style>
