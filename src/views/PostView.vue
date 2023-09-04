<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue'

import { useProductsStore } from '../stores/products'
import { useOrdersStore } from '../stores/orders'

const productsStore = useProductsStore()
const ordersStore = useOrdersStore()

const tabActiveId = ref(0)

const dialog = reactive({
  // 選擇產品
  activeProductItem: false,
  // 確認訂單
  confirmOrderList: false,
})

const computedDialog = reactive({
  status: false,
  deposit: 0,
  computedNumber: computed(() =>
    computedDialog.deposit > ordersStore.ordersList.total.totalPrice
      ? computedDialog.deposit - ordersStore.ordersList.total.totalPrice
      : '--',
  ),
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
})
</script>

<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row class="ma-0 pa-0">
      <!-- 點單項目 -->
      <v-col cols="5" md="4" class="order-area bg-grey-darken-3 px-0 d-flex flex-column h-screen">
        <!-- 操作 -->
        <v-container class="py-0 px-2">
          <v-row dense>
            <v-col cols="12">
              <!-- 清空購物車 -->
              <v-btn block color="error" @click="ordersStore.ordersList.items.length = 0">
                <v-icon icon="mdi-delete-empty" />
              </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <v-divider class="mt-4" />

        <div class="flex-grow-1 d-flex flex-column">
          <!-- 點單項目 -->
          <div class="flex-grow-1 h-0 overflow-y-auto">
            <!-- new -->
            <div class="order-list">
              <div
                class="order-item d-sm-flex align-sm-center justify-sm-space-between"
                v-for="(item, index) in ordersStore.ordersList.items"
                :key="item.product._id"
              >
                <div>
                  <!-- 產品名稱 -->
                  <div class="product-name text-subtitle-2">
                    {{ item.product.name }}
                  </div>
                  <!-- 加料 -->
                  <div class="special my-2">
                    <div v-for="extraItem in item.extras" :key="extraItem._id" class="text-caption">
                      <v-icon icon="mdi-plus" color="grey"></v-icon>
                      <span class="px-1 bg-grey rounded mr-1 font-weight-bold text-black">
                        {{ extraItem.type }}
                      </span>
                      <span class="text-grey font-weight-bold">
                        {{ extraItem.name }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="d-sm-flex align-center">
                  <!-- 數量 -->
                  <div class="product-quantity mr-sm-2">
                    <div class="d-flex align-center justify-center">
                      <v-icon
                        v-show="item.quantity > 1"
                        icon="mdi-minus-circle"
                        color="error"
                        @click="ordersStore.orderItemQuantityPlusOrMinus('minus', item)"
                      ></v-icon>

                      <v-icon
                        v-show="item.quantity < 2"
                        icon="mdi-trash-can-outline"
                        color="error"
                        @click="
                          ordersStore.dropOrdersListItemByIndex(ordersStore.ordersList, index)
                        "
                      ></v-icon>
                      <span class="mx-2 text-h6 text-md-h4 text-white">
                        {{ item.quantity }}
                      </span>
                      <v-icon
                        icon="mdi-plus-circle"
                        color="success"
                        @click="ordersStore.orderItemQuantityPlusOrMinus('plus', item)"
                      ></v-icon>
                    </div>
                  </div>
                  <!-- 小計 -->
                  <div class="product-total text-center font-weight-bold text-h6">
                    $ {{ item.total }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <v-divider />

          <!-- 數量 -->
          <div class="order-total px-4 py-2 pb-0 text-caption">
            <div class="d-flex">
              <span>數量</span>
              <v-spacer />
              <span>{{ ordersStore.ordersList.total.quantity }}</span>
            </div>

            <!-- 小計 -->
            <div class="d-flex">
              <span>小計</span>
              <v-spacer />
              <span>{{ ordersStore.ordersList.total.subTotal }}</span>
            </div>

            <!-- 服務費 -->
            <div class="d-flex">
              <span>服務費</span>
              <v-spacer />
              <span>{{ ordersStore.ordersList.total.service }}</span>
            </div>

            <!-- 優惠 -->
            <div class="d-flex">
              <span>優惠費</span>
              <v-spacer />
              <span>{{ ordersStore.ordersList.total.discount }}</span>
            </div>

            <v-divider class="my-2" />

            <!-- 總價 -->
            <div class="d-flex flex-column flex-sm-row my-1 text-h5">
              <span class="">總價</span>
              <v-spacer />
              <span>{{ ordersStore.ordersList.total.totalPrice }}</span>
            </div>

            <!-- 送出訂單 -->
            <div>
              <v-btn
                :disabled="ordersStore.ordersList.items.length < 1"
                block
                size="large"
                color="success"
                variant="flat"
                @click="dialog.confirmOrderList = true"
              >
                結帳
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>

      <!-- 產品 -->
      <v-col
        cols="7"
        md="8"
        class="order-type bg-grey-darken-3 pa-0 h-screen overflow-x-hidden overflow-y-auto"
      >
        <!-- TABs -->
        <v-tabs
          v-model="tabActiveId"
          color="primary"
          bg-color="grey-darken-3"
          class="px-6 product-tabs"
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
                    cols="12"
                    sm="6"
                    md="4"
                    class="pa-1"
                  >
                    <v-card @click="ordersStore.selectedProduct(productItem, dialog, true)">
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
                          <span class="text-h5 font-weight-bold">{{ productItem.price }}</span>
                        </div>
                      </template>
                      <!-- 快捷新增按鈕 -->
                      <button
                        class="fast-add-item-btn"
                        @click.stop="
                          ordersStore.fashAddActiveProductItemToOrdersList(
                            ordersStore.ordersList,
                            productItem,
                            dialog,
                          )
                        "
                      >
                        <v-icon size="30" color="blue" icon="mdi-lightning-bolt-circle" />
                      </button>
                      <!-- 快捷新增按鈕 (含提袋) -->
                      <button
                        v-show="productItem.type !== '塑膠提袋'"
                        class="fast-add-item-and-sack-btn"
                        @click.stop="
                          ordersStore.fashAddActiveProductItemAndBagToOrdersList(
                            ordersStore.ordersList,
                            productItem,
                            dialog,
                          )
                        "
                      >
                        <v-icon size="30" color="error" icon="mdi-sack" />
                      </button>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>

  <!-- 產品資訊 Dialog -->
  <v-dialog transition="dialog-bottom-transition" v-model="dialog.activeProductItem" width="400">
    <v-card>
      <v-card-title class="pt-4 px-6 text-primary">
        {{ ordersStore.activeProductItem.product.name }}
      </v-card-title>
      <v-card-subtitle class="px-6">
        {{ ordersStore.activeProductItem.product.description }}
      </v-card-subtitle>
      <v-divider class="mt-4" />
      <v-card-text>
        <!-- 加料 -->
        <div v-if="ordersStore.activeProductItem.product?.extras?.length > 0">
          <h4 class="mb-4">加料</h4>

          <div
            v-for="extras in ordersStore.activeProductItem.product.extras"
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
              v-model="ordersStore.activeProductItem.form.extras"
              :value="extra"
              density="compact"
              hide-details
              :label="extra.name + ' +' + extra.price"
            />
          </div>
        </div>

        <h4 class="mb-4">數量</h4>
        <v-text-field
          v-model="ordersStore.activeProductItem.quantity"
          type="number"
          min="1"
          append-icon="mdi-plus"
          prepend-icon="mdi-minus"
          variant="outlined"
          readonly
          @click:append="ordersStore.activeProductItemQuantity(true)"
          @click:prepend="ordersStore.activeProductItemQuantity()"
        />

        <div class="operate">
          <v-btn
            block
            color="success"
            @click="
              ordersStore.addActiveProductItemToOrdersList(
                ordersStore.activeProductItem,
                ordersStore.ordersList,
                dialog,
              )
            "
          >
            新增
            <span class="font-weight-bold text-yellow-accent-4">
              {{ ordersStore.activeProductItem.quantity }}
            </span>
            項目到訂單
            <span class="font-weight-bold text-yellow-accent-4"
              >NT${{ ordersStore.activeProductItem.price }}</span
            >
          </v-btn>
          <v-btn block color="error" class="mt-4" @click="dialog.activeProductItem = false">
            取消
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- confirm Dialog -->
  <v-dialog transition="dialog-bottom-transition" v-model="dialog.confirmOrderList" width="400">
    <v-card>
      <v-card-item class="text-primary text-center pb-2" title="訂單明細"></v-card-item>
      <v-card-text>
        <div class="order-list-area px-4">
          <div
            v-for="orderItem in ordersStore.ordersList.items"
            :key="orderItem.product._id"
            class="order-item d-flex align-center"
          >
            <div class="order-item_name font-weight-bold">
              {{ orderItem.product.name }}

              <div v-for="extraItem in orderItem.extras" :key="extraItem._id" class="text-caption">
                <v-icon icon="mdi-plus"></v-icon>
                <span class="px-1 bg-grey rounded mr-1">{{ extraItem.type }}</span>
                <span>
                  {{ extraItem.name }}
                </span>
              </div>
            </div>
            <v-spacer></v-spacer>
            <div class="order-item_quantity mr-4">
              {{ orderItem.quantity }}
            </div>
            <div class="order-item_total-price">
              $
              <span class="font-weight-bold">
                {{ orderItem.total }}
              </span>
            </div>
          </div>

          <!-- 手機未三碼 -->
          <div class="mt-4">
            <v-text-field
              v-model="ordersStore.ordersList.mobileNoThreeDigits"
              clearable
              type="tel"
              label="手機未三碼"
              variant="outlined"
            ></v-text-field>
          </div>

          <!-- 備註 -->
          <div class="note-area">
            <v-textarea
              v-model="ordersStore.ordersList.note"
              rows="2"
              hide-details="true"
              label="備註"
              variant="outlined"
            ></v-textarea>
          </div>

          <div class="order-list-total d-flex my-4 font-weight-bold">
            <div class="order-list-total__items">
              共 {{ ordersStore.ordersList.total.quantity }} 項
            </div>
            <v-spacer></v-spacer>
            <div class="order-list-total__total">
              <v-btn variant="outlined" @click="computedDialog.status = true">
                總計 {{ ordersStore.ordersList.total.totalPrice }} 元
              </v-btn>
            </div>
          </div>
        </div></v-card-text
      >

      <template #actions>
        <v-container class="pt-0">
          <v-row class="px-6">
            <!-- 已付款 -->
            <v-col cols="12" class="px-1">
              <v-btn
                size="large"
                @click="
                  ordersStore.submitOrderList({
                    list: ordersStore.ordersList,
                    isPaid: true,
                    paymentType: 'cash',
                    dialog,
                  })
                "
                block
                variant="flat"
                color="blue"
              >
                <span class="px-2 py-1 bg-white rounded mr-2">現金</span>
                已付款，送出訂單</v-btn
              >
            </v-col>

            <!-- LINE PAY 已付款 -->
            <v-col cols="12" class="px-1">
              <v-btn
                size="large"
                @click="
                  ordersStore.submitOrderList({
                    list: ordersStore.ordersList,
                    isPaid: true,
                    paymentType: 'Line Pay',
                    dialog,
                  })
                "
                block
                variant="flat"
                color="success"
              >
                <span class="px-2 py-1 bg-white rounded mr-2">LINE Pay</span>
                已支付，送出訂單</v-btn
              >
            </v-col>

            <!-- 未付款 -->
            <v-col cols="12" class="px-1">
              <v-btn
                color="error"
                size="large"
                @click="
                  ordersStore.submitOrderList({
                    list: ordersStore.ordersList,
                    isPaid: false,
                    dialog,
                  })
                "
                block
                variant="outlined"
                >未付款，送出訂單</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-card>
  </v-dialog>

  <!-- 計算 -->
  <v-dialog v-model="computedDialog.status" width="280">
    <v-card>
      <v-card-title> 找零 </v-card-title>
      <v-card-text>
        <div>
          <v-text-field
            autofocus
            v-model.number="computedDialog.deposit"
            clearable
            label="收入金額"
            variant="outlined"
          ></v-text-field>
        </div>
        <div>訂單總金額: {{ ordersStore.ordersList.total.totalPrice }}</div>
        <div class="text-h6 font-italic text-primary">
          找錢: {{ computedDialog.computedNumber }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" variant="text" @click="computedDialog.status = false"> Close </v-btn>
      </v-card-actions>
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
  bottom: 5px;
  right: 5px;
}
.fast-add-item-and-sack-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}

.order-item {
  border-bottom: solid #2e2e2e 1px;
  padding: 1rem;
  background: rgb(var(--v-theme-surface));
}

.product-tabs {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
