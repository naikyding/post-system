<script setup>
import { reactive, ref } from 'vue'
import { useSystemOrderList } from '@/stores/orders'
import { dateFormat } from '@/utils/day'

import Swal from 'sweetalert2'
import EmptyBox from '@/components/EmptyBox.vue'
import dayJS from 'dayjs'

const systemOrderStore = useSystemOrderList()

const dialog = reactive({
  confirmOrderList: false,
})

const confirmEditOrderDialog = ref(false)

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
  confirmEditOrderDialog.value = true

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
  putExtrasContent: {
    ids: [],
    total: null,
  },

  originOrderItemContent: {},
  originProductItemContent: {},
})

function addBagToOrderItem() {
  const bagSizeSId = '64cf45d1ee6af4dc14dcb456'

  const addExtrasItem = orderListProductEditForm.originProductItemContent.product.extras.find(
    (extrasId) => extrasId._id === bagSizeSId,
  )

  if (addExtrasItem) {
    orderListProductEditForm.putExtrasContent =
      orderListProductEditForm.originProductItemContent.extras.reduce(
        (init, cur, index) => {
          init = { ids: [...init.ids, cur._id], total: init.total + cur.price }

          if (index + 1 === orderListProductEditForm.originProductItemContent.extras.length) {
            init = {
              ids: [...init.ids, addExtrasItem._id],
              total: init.total + addExtrasItem.price,
            }
            return init
          }

          return init
        },
        { ids: [], total: 0 },
      )

    const data = {
      orderId: orderListProductEditForm.orderId,
      itemId: orderListProductEditForm.orderItemId,
      extras: [...orderListProductEditForm.putExtrasContent.ids],
      extrasTotal: orderListProductEditForm.putExtrasContent.total,
    }

    systemOrderStore.updateOrderProductItem(data)
  }
}
</script>

<template>
  <!-- 沒有資料 -->
  <template v-if="systemOrderStore.orderList.length < 1">
    <EmptyBox class="h-screen-pt-48px" />
  </template>

  <template v-else>
    <v-table fixed-header height="calc(100dvh - 48px)">
      <thead>
        <tr class="text-caption">
          <th class="text-left min-width-128px">執行狀態</th>
          <th class="text-left min-width-63px">項目</th>
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
          <th class="text-left">加料</th>
          <th class="text-left">數量</th>
          <th class="text-left min-width-90px">備註</th>
          <!-- <th class="text-left min-width-90px">付款狀態</th> -->
          <th class="text-left">未三碼</th>
          <th class="text-center">-</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="items in systemOrderStore.orderList" :key="items._id">
          <tr v-for="(product, index) in items.items" :key="product._id">
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
                    {{ `${product.status ? '完成' : '待處理'}` }}
                  </span>
                </template>
              </v-switch>
            </td>
            <td class="font-weight-bold">
              {{ `${index + 1} / ${items.items.length}` }}
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
                class="text-primary font-weight-bold"
                @click="showOrderListDetails(items)"
              >
                {{ product.product.name }}
              </a>
            </td>
            <td class="text-subtitle-2 font-weight-bold text-primary py-2">
              <div v-for="extra in product.extras" :key="extra._id">
                +<span class="bg-primary px-1 rounded mx-1 text-black">
                  {{ extra.type }}
                </span>
                <span>{{ extra.name }}</span>
              </div>
            </td>
            <td class="text-right text-h3">{{ product.quantity }}</td>
            <td class="font-weight-bold">
              <span class="text-primary">
                {{ items.note }}
              </span>
            </td>
            <td>
              <span class="px-2 py-1 rounded-lg bg-success text-h6 ml-2 font-italic">
                {{ items.mobileNoThreeDigits || '--' }}
              </span>
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

        <div class="order-list-area px-4">
          <div
            v-for="orderItem in systemOrderStore.activeOrderList.items"
            :key="orderItem.product._id"
            class="order-item d-flex align-center"
          >
            <v-btn
              @click="ShowAddBagToOrderItemDialog(systemOrderStore.activeOrderList, orderItem)"
              icon="mdi-medical-bag"
              color="warning"
              class="mr-2"
            ></v-btn>

            <div class="order-item_name font-weight-bold">
              <span>
                {{ orderItem.product.name }}
              </span>

              <div
                v-for="extraItem in orderItem.extras"
                :key="extraItem._id"
                class="text-caption mt-2"
              >
                <v-icon icon="mdi-plus"></v-icon>
                <span class="px-1 bg-grey rounded mr-1">{{ extraItem.type }}</span>
                <span>
                  {{ extraItem.name }}
                </span>
              </div>
            </div>

            <v-spacer></v-spacer>

            <div class="order-item_quantity mr-3">x{{ orderItem.quantity }}</div>
            <div class="order-item_total-price text-left">
              <span class="font-weight-bold"> ${{ orderItem.price }} </span>
            </div>
          </div>

          <v-row class="mt-2">
            <v-col cols="6">
              <!-- 加購 -->
              <v-btn
                @click="addBag('64cf45d1ee6af4dc14dcb456', systemOrderStore.activeOrderList)"
                height="56"
                block
                rounded="lg"
                variant="flat"
                color="blue"
              >
                <div class="d-flex justify-center align-center">
                  <v-icon icon="mdi-plus" />
                  1
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
                color="blue"
              >
                <div class="d-flex justify-center align-center">
                  <v-icon icon="mdi-plus" />
                  2
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
          <v-row class="px-6">
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
                size="large"
                block
                variant="flat"
                color="success"
              >
                所有項目完成，更新訂單狀態
              </v-btn>
            </v-col>

            <v-col cols="12" class="px-1">
              <v-btn
                @click="
                  deleteDialog(
                    systemOrderStore.activeOrderList._id,
                    {
                      status: 'cancelled',
                    },
                    systemOrderStore.updateOrderContent,
                  )
                "
                size="large"
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
  <v-dialog v-model="confirmEditOrderDialog" width="auto">
    <v-card>
      <v-card-text>
        <div class="text-center text-primary mb-4 text-h6 font-weight-bold">
          {{ orderListProductEditForm.originProductItemContent.product.name }}
        </div>
        確定修改訂單內容嗎?
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn @click="addBagToOrderItem" variant="flat" color="success" block>是的，修改</v-btn>
      </v-card-actions>
      <v-card-actions class="px-4">
        <v-btn variant="outlined" color="error" block @click="confirmEditOrderDialog = false"
          >取消</v-btn
        >
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
