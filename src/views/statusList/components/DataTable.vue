<script setup>
import { reactive, ref } from 'vue'
import { useSystemOrderList } from '@/stores/orders'

import Swal from 'sweetalert2'
import EmptyBox from '@/components/EmptyBox.vue'
import dayJS from 'dayjs'

const systemOrderStore = useSystemOrderList()

const dialog = reactive({
  confirmOrderList: false,
})

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
    <EmptyBox class="h-screen-pt-48px" />
  </template>

  <!-- 有資料 -->
  <template v-else>
    <v-table fixed-header height="calc(100dvh - 48px)">
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

            <span v-else> 建立時間 </span>
          </th>
          <th class="text-left">商品名稱</th>
          <th class="text-left">數量</th>
          <!-- <th class="text-left min-width-90px">付款狀態</th> -->
          <th class="text-left">未三碼</th>
          <th class="text-center">-</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="items in systemOrderStore.orderList" :key="items._id">
          <tr v-for="(product, index) in items.items" :key="product?._id">
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
                  {{ extra.extraItem.name }} x{{ extra.quantity }}
                </v-chip>
              </div>

              <!-- 備註 -->
              <div v-if="items.note">
                <v-chip class="my-1">
                  {{ items.note }}
                </v-chip>
              </div>
            </td>
            <td class="text-right">
              <div class="text-h3">
                {{ product.quantity }}
              </div>
              <span class="text-caption"> ({{ `${index + 1}/${items.items.length}` }}) </span>
            </td>
            <td>
              <span class="px-2 py-1 rounded-lg bg-success text-h6 ml-2 font-italic">
                {{ items.mobileNoThreeDigits || '--' }}
              </span>

              <!-- 支付方式 -->
              <v-chip class="ma-2" :color="items.paymentType === 'cash' ? 'yellow' : 'success'">
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
    </v-table>
  </template>

  <!-- confirm Dialog -->
  <v-dialog transition="dialog-bottom-transition" v-model="dialog.confirmOrderList" width="400">
    <v-card>
      <v-card-item class="text-primary text-center pb-2" title="訂單明細"></v-card-item>
      <v-card-text>
        <div class="px-4">
          <v-btn rounded="xl" variant="tonal" block>
            未三碼
            <span class="text-h6 ml-2 font-italic">
              {{ systemOrderStore.activeOrderList.mobileNoThreeDigits || '--' }}
            </span>
          </v-btn>
        </div>

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
              總計 {{ systemOrderStore.activeOrderList.totalPrice }} 元
            </div>
          </div>

          <v-alert
            v-show="!systemOrderStore.activeOrderList.isPaid"
            type="warning"
            title="未付款"
            text="此訂單，目前尚未付款完成，請確認付款後再更新訂單狀態。"
          ></v-alert>
        </div>
      </v-card-text>

      <template #actions>
        <v-container class="pt-0">
          <v-row>
            <v-col cols="12" class="px-1">
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
  <v-dialog v-model="confirmEditOrderDialog.status" width="auto">
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
</style>
