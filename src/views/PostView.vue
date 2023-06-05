<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import catchAsync from '@/utils/catchAsync'
import { useProductsStore, useOrderStore } from '../stores/products'
import { useRouter } from 'vue-router'

const router = useRouter()
const productsStore = useProductsStore()
const orderStore = useOrderStore()

const tabActiveId = ref(0)

// 選擇口味 dialog
const selectorDialog = ref(false)

// 點擊產品功能
function selectedProduct(productItem, dialogStatus) {
  activeProductItem.product = productItem
  selectorDialog.value = dialogStatus
}

// (重置) 當前選擇產品項目
function resetActiveProductItem() {
  activeProductItem.form.extras = []
  activeProductItem.quantity = 1
  activeProductItem.product = {}
}

// 產品彈窗 若關閉，重置選擇產品
watch(selectorDialog, (newStatus) => {
  if (!newStatus) resetActiveProductItem()
})

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

// 當前選擇產品項目 (dialog) 加減數量
function activeProductItemQuantity(plusType) {
  if (plusType) {
    if (activeProductItem.quantity > 4) return false
    return activeProductItem.quantity++
  }
  if (activeProductItem.quantity < 2) return false
  activeProductItem.quantity--
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

// 快速將 當前選擇產品項目 加入 購物車
async function fashAddActiveProductItemToOrdersList(ordersList, productItem) {
  await selectedProduct(productItem, false)
  await addActiveProductItemToOrdersList(activeProductItem, ordersList)
}

// 當前產品項目加入購物車
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

// 購物車清單初始內容
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

// 關閉產品彈窗
function closeSelectorDialog() {
  selectorDialog.value = false
}

// 刪除購物車指定項目
function dropOrdersListItemByIndex(list, index) {
  list.items = list.items.filter((item, itemIndex) => itemIndex !== index)
}

// 送出訂單功能
const submitOrderList = catchAsync(async (orderList) => {
  // const formatOrderList = orderList.reduce((acc, cur) => {
  //   return (acc = [
  //     ...acc,
  //     {
  //       flavor: cur.item._id,
  //       extras: cur.extras.map((item) => item._id),
  //       quantity: cur.quantity,
  //       total: cur.price * cur.quantity,
  //     },
  //   ])
  // }, [])
  // const { data } = await orderStore.postOrderList(formatOrderList)
  // console.log(data)
  // if (data.status) return router.push('/list-status')
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
              <!-- 清空購物車 -->
              <v-btn block color="error" @click="ordersList.items.length = 0">
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
                      <span class="py-2">
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
                    <v-icon
                      v-show="item.quantity > 1"
                      icon="mdi-minus"
                      @click="item.quantity--"
                    ></v-icon>

                    <v-icon
                      v-show="item.quantity < 2"
                      icon="mdi-trash-can-outline"
                      @click="dropOrdersListItemByIndex(ordersList, index)"
                    ></v-icon>
                    <span>
                      {{ item.quantity }}
                    </span>
                    <v-icon icon="mdi-plus" @click="item.quantity++"></v-icon>
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

        <div v-show="ordersList.items.length > 0" class="submit-operate px-6 w-100">
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
