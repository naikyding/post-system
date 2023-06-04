<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import catchAsync from '@/utils/catchAsync'
import { useProductsStore, useOrderStore } from '../stores/products'
import { useRouter } from 'vue-router'

const router = useRouter()
const productsStore = useProductsStore()
const orderStore = useOrderStore()

const tabActiveId = ref(0)

// 選擇口味項目
const selectedProductItem = ref({})
// 選擇口味 dialog
const selectorDialog = ref(false)
// 選擇口味功能
function selectedProduct(productItem, dialogStatus) {
  activeProductItem.product = productItem
  selectorDialog.value = dialogStatus
}

function resetActiveProductItem() {
  activeProductItem.form.extras = []
  activeProductItem.quantity = 1
  activeProductItem.product = {}
}

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

function activeProductItemQuantity(plusType) {
  if (plusType) {
    if (activeProductItem.quantity > 4) return false
    return activeProductItem.quantity++
  }
  if (activeProductItem.quantity < 2) return false
  activeProductItem.quantity--
}

// 點單項目是否存在清單中
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

async function fashAddActiveProductItemToOrdersList(ordersList, productItem) {
  await selectedProduct(productItem, false)
  await addActiveProductItemToOrdersList(activeProductItem, ordersList)
}

function addActiveProductItemToOrdersList(productItem, ordersList) {
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

  selectorDialog.value = false
}

// dialog 選擇項目
const selectedItem = ref({
  product: [],
  extras: [],
  quantity: 1,
  price: computed(() => {
    let extrasPriceTotal = 0
    selectedItem.value.extras.forEach((item) => {
      extrasPriceTotal += item.price
    })

    return selectedItem.value.item.price
      ? (selectedItem.value.item.price + extrasPriceTotal) * selectedItem.value.quantity
      : 0
  }),
})

watch(selectorDialog, (newStatus) => {
  if (!newStatus) resetActiveProductItem()
})

// 購物車清單
const ordersList = reactive({
  items: [],

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

// -------------------------------------------
// 購物車
const orderList = ref([])

const editMode = ref(false)
const orderListDeleteItem = ref([])

function removeOrderItemFromOrderList(orderList, orderListDeleteItemList) {
  orderListDeleteItemList.forEach((deleteItem) => {
    orderList.splice(orderList.indexOf(deleteItem), 1)
  })
  orderListDeleteItemList.length = 0
}

function resetSelectorForm(selectedItem) {
  selectedItem.item = {}
  selectedItem.extras.length = 0

  selectedItem.quantity = 1
}

function closeSelectorDialog() {
  selectorDialog.value = false
}

// 加入購物車
async function addOrderItem(list, item, disableDialog) {
  const addItem = {
    product: list.product,
    extras: [...item.extras],
    price: item.price,
    quantity: item.quantity,
  }

  const listMatchItem = await sameOrderItem(list, addItem)

  if (listMatchItem) listMatchItem.quantity++
  else list.push(addItem)

  if (disableDialog) return resetSelectorForm(item)

  closeSelectorDialog(item)
}

// 點單項目是否存在清單中
async function sameOrderItem(list, item) {
  const itemExtrasLength = item.extras.length

  const res = await list.find((listItem) => {
    const listItemExtrasLength = listItem.extras.length
    const sameItem = listItem.item === item.item
    const sameNoExists = listItem.extras.length < 1 && item.extras.length < 1

    // 口味在清單中，無配料
    if (sameItem && sameNoExists) return true

    // 口味在清單中，有配料
    if (sameItem) {
      let extrasMatchNum = 0
      item.extras.forEach((itemExtrasItem) => {
        listItem.extras.forEach((listItemExtrasItem) => {
          if (listItemExtrasItem._id === itemExtrasItem._id) extrasMatchNum++
        })
      })
      if (
        itemExtrasLength > 0 &&
        itemExtrasLength === extrasMatchNum &&
        itemExtrasLength === listItemExtrasLength
      )
        return true
    }
  })

  return res
}

function selectorFlavors(itemData, selectedItem, disableDialog) {
  selectedItem.item = itemData

  if (disableDialog) return false
  selectorDialog.value = true
}

async function fastAddItem(list, item, selectedItem) {
  await selectorFlavors(item, selectedItem, true)
  addOrderItem(list, selectedItem, true)
}

const submitOrderList = catchAsync(async (orderList) => {
  const formatOrderList = orderList.reduce((acc, cur) => {
    return (acc = [
      ...acc,
      {
        flavor: cur.item._id,
        extras: cur.extras.map((item) => item._id),
        quantity: cur.quantity,
        total: cur.price * cur.quantity,
      },
    ])
  }, [])

  const { data } = await orderStore.postOrderList(formatOrderList)
  console.log(data)
  if (data.status) return router.push('/list-status')
})

onMounted(async () => {
  // 取得產品最表
  await productsStore.getProducts()
})
</script>

<template>
  <v-container fluid class="ma-0 pa-0 h-100">
    <v-row class="ma-0 pa-0 h-100">
      <!-- 點單項目 -->
      <v-col cols="4" md="4" class="order-area bg-grey-darken-3 px-0 d-flex flex-column">
        <!-- 操作 -->
        <v-container class="py-0 px-2">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-btn block @click="editMode = !editMode">
                <v-icon icon="mdi-pencil" />
              </v-btn>
            </v-col>
            <v-col v-show="orderListDeleteItem.length > 0" cols="12" sm="6">
              <v-btn block @click="removeOrderItemFromOrderList(orderList, orderListDeleteItem)">
                <v-icon icon="mdi-delete" />
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn block color="error" @click="orderList.length = 0">
                <v-icon icon="mdi-delete-empty" />
              </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <v-divider class="mt-4" />

        <div class="flex-grow-1 d-flex flex-column">
          <!-- 點單項目 -->
          <div class="flex-grow-1 h-0 overflow-y-auto">
            <v-table hover>
              <tbody>
                <tr
                  v-for="(item, index) in ordersList.items"
                  :key="item.product._id"
                  class="order-item"
                >
                  <td class="py-3 pr-0">
                    <div class="d-flex">
                      <!-- addorderListDeleteItem(orderList, index, orderListDeleteItem) -->
                      <v-checkbox
                        v-show="editMode"
                        v-model="orderListDeleteItem"
                        hide-details
                        density="compact"
                        :value="orderList[index]"
                      >
                        <template #label>
                          {{ item.product.name }}
                        </template>
                      </v-checkbox>

                      <span v-show="!editMode" class="py-2">
                        {{ item.product.name }}
                      </span>
                    </div>
                    <div class="special">
                      <span v-for="(extra, index) in item.extras" :key="extra" class="text-caption">
                        {{ extra.name }}
                        <span v-if="index !== item.extras.length - 1">/</span>
                      </span>
                    </div>
                  </td>
                  <td class="text-right px-1">
                    {{ item.quantity }}
                  </td>
                  <td class="text-right pl-1 pr-4">
                    {{ item.total }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <v-divider />

          <!-- 數量 -->
          <div class="order-total px-4 py-2 pb-0 text-caption">
            <div class="d-flex">
              <span>數量</span>
              <v-spacer />
              <span>{{ ordersList.total.quantity }}</span>
            </div>

            <!-- 小計 -->
            <div class="d-flex">
              <span>小計</span>
              <v-spacer />
              <span>{{ ordersList.total.subTotal }}</span>
            </div>

            <!-- 服務費 -->
            <div class="d-flex">
              <span>服務費</span>
              <v-spacer />
              <span>{{ ordersList.total.service }}</span>
            </div>

            <!-- 優惠 -->
            <div class="d-flex">
              <span>優惠費</span>
              <v-spacer />
              <span>{{ ordersList.total.discount }}</span>
            </div>

            <v-divider class="my-2" />

            <!-- 總價 -->
            <div class="d-flex my-1 text-yellow-accent-4 text-h5">
              <span class="">總價</span>
              <v-spacer />
              <span>{{ ordersList.total.totalPrice }}</span>
            </div>
          </div>
        </div>
      </v-col>

      <!-- 產品 -->
      <v-col cols="8" md="8" class="order-type bg-grey-darken-3 pa-0">
        <!-- TABs -->
        <v-tabs v-model="tabActiveId" bg-color="secondary" class="px-6">
          <v-tab
            v-for="(productItems, index) in productsStore.products"
            :key="productItems + index"
            :value="index"
          >
            {{ productItems.type }}
          </v-tab>
        </v-tabs>

        <!-- 產品列表 -->
        <v-card-text>
          <v-window v-model="tabActiveId">
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
                    cols="4"
                    class="pa-1"
                  >
                    <v-card @click="selectedProduct(productItem, true)">
                      <template #title>
                        <div class="d-flex flex-column">
                          <div class="text-subtitle-1 font-weight-bold">
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
                          <span class="text-h5 font-weight-bold">{{ productItem.price }}</span>
                        </div>
                      </template>
                      <!-- 快捷新增按鈕 -->
                      <button
                        class="fast-add-item-btn"
                        @click.stop="fashAddActiveProductItemToOrdersList(ordersList, productItem)"
                      >
                        <v-icon size="30" icon="mdi-lightning-bolt-circle" />
                      </button>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card-text>

        <div v-show="orderList.length > 0" class="submit-operate px-6 w-100">
          <v-btn block @click="submitOrderList(orderList, orderStore)"> 送出訂單 </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Dialog -->
  <v-dialog v-model="selectorDialog" width="400">
    <template #activator="{ props }">
      <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
    </template>

    <v-card>
      <v-card-title class="pt-4 px-6">
        {{ activeProductItem.product.name }}
      </v-card-title>
      <v-card-subtitle class="px-6">
        {{ activeProductItem.product.description }}
      </v-card-subtitle>
      <v-divider class="mt-4" />
      <v-card-text>
        <div>
          <h4 class="mb-4">加料</h4>

          <div
            v-for="extras in activeProductItem.product.extras"
            :key="extras"
            class="bg-black rounded-lg py-2 px-4 mb-3"
          >
            <p class="font-weight-bold">
              {{ extras.type }}
            </p>
            <v-divider class="my-1" />
            <v-checkbox
              v-for="extra in extras.items"
              :key="extra"
              v-model="activeProductItem.form.extras"
              :value="extra"
              density="compact"
              hide-details
              :label="extra.name + ' +' + extra.price"
            />
          </div>
        </div>

        <h4 class="mb-4">數量</h4>
        <v-text-field
          v-model="activeProductItem.quantity"
          type="number"
          min="1"
          append-icon="mdi-plus"
          prepend-icon="mdi-minus"
          variant="outlined"
          readonly
          @click:append="activeProductItemQuantity(true)"
          @click:prepend="activeProductItemQuantity()"
        />

        <div class="operate">
          <v-btn
            block
            color="success"
            @click="addActiveProductItemToOrdersList(activeProductItem, ordersList)"
          >
            新增
            <span class="font-weight-bold text-yellow-accent-4">
              {{ activeProductItem.quantity }}
            </span>
            項目到訂單
            <span class="font-weight-bold text-yellow-accent-4"
              >NT${{ activeProductItem.price }}</span
            >
          </v-btn>
          <v-btn block color="error" class="mt-4" @click="closeSelectorDialog"> 取消 </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
table {
  td:not(:last-child) {
    color: lightblue;
  }
}

.order-type {
  position: relative;
  .submit-operate {
    position: absolute;
    bottom: 1rem;
  }
}

.fast-add-item-btn {
  position: absolute;
  bottom: 1px;
  right: 1px;
}
</style>
