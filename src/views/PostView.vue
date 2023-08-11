<script setup>
import { ref, onMounted, reactive, watch } from 'vue'

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
    <v-row class="ma-0 pa-0 h-screen">
      <!-- 點單項目 -->
      <v-col cols="4" md="4" class="order-area bg-grey-darken-3 px-0 d-flex flex-column">
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
            <v-table hover>
              <tbody>
                <tr
                  v-for="(item, index) in ordersStore.ordersList.items"
                  :key="item.product._id"
                  class="order-item"
                >
                  <td class="py-3 pr-0">
                    <div class="d-flex">
                      <span class="">
                        {{ item.product.name }}
                      </span>
                    </div>
                    <div class="special">
                      <div
                        v-for="extraItem in item.extras"
                        :key="extraItem._id"
                        class="text-caption"
                      >
                        <v-icon icon="mdi-plus"></v-icon>
                        <span class="px-1 bg-grey rounded mr-1">{{ extraItem.type }}</span>
                        <span>
                          {{ extraItem.name }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="text-right px-1">
                    <v-icon
                      v-show="item.quantity > 1"
                      icon="mdi-minus"
                      @click="ordersStore.orderItemQuantityPlusOrMinus('minus', item)"
                    ></v-icon>

                    <v-icon
                      v-show="item.quantity < 2"
                      icon="mdi-trash-can-outline"
                      @click="ordersStore.dropOrdersListItemByIndex(ordersStore.ordersList, index)"
                    ></v-icon>
                    <span>
                      {{ item.quantity }}
                    </span>
                    <v-icon
                      icon="mdi-plus"
                      @click="ordersStore.orderItemQuantityPlusOrMinus('plus', item)"
                    ></v-icon>
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
            <div class="d-flex my-1 text-h5">
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
      <v-col cols="8" md="8" class="order-type bg-grey-darken-3 pa-0">
        <!-- TABs -->
        <v-tabs v-model="tabActiveId" color="primary" class="px-6" center-active show-arrows>
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
                    cols="4"
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
                        <v-icon size="30" icon="mdi-lightning-bolt-circle" />
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
      <v-card-item class="bg-grey text-center pb-2" title="訂單明細"></v-card-item>
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
              總計 {{ ordersStore.ordersList.total.totalPrice }} 元
            </div>
          </div>
        </div></v-card-text
      >

      <template #actions>
        <v-container class="pt-0">
          <v-row class="px-6">
            <v-col cols="6" class="px-1">
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
            <v-col cols="6" class="px-1">
              <v-btn
                size="large"
                @click="
                  ordersStore.submitOrderList({
                    list: ordersStore.ordersList,
                    isPaid: true,
                    dialog,
                  })
                "
                block
                variant="flat"
                color="success"
                >已付款，送出訂單</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </template>
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

.order-item {
  border-bottom: solid #2e2e2e 1px;
  padding: 1rem;
}
</style>
