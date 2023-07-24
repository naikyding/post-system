<script setup>
import { reactive } from 'vue'
import { useSystemOrderList } from '@/stores/orders'
import { dateFormat } from '@/utils/day'

import Swal from 'sweetalert2'
import EmptyBox from '@/components/EmptyBox.vue'

const systemOrderStore = useSystemOrderList()

const dialog = reactive({
  confirmOrderList: false,
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
          <th class="text-left">時間</th>
          <th class="text-left">商品名稱</th>
          <th class="text-left">加料</th>
          <th class="text-left">數量</th>
          <th class="text-left min-width-90px">付款狀態</th>
          <th class="text-left">備註</th>
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
            <td class="text-caption">
              {{ `${index + 1} / ${items.items.length}` }}
            </td>
            <td class="text-caption">
              <div class="day">{{ dateFormat(items.createdAt).split(' ')[0] }}</div>
              <div class="day">{{ dateFormat(items.createdAt).split(' ')[1] }}</div>
            </td>
            <td>
              {{ product.product.name }}
            </td>
            <td class="text-caption">
              <div v-for="extra in product.extras" :key="extra._id">
                +<span class="bg-grey px-1 rounded-lg mx-1">{{ extra.type }}</span>
                <span>{{ extra.name }}</span>
              </div>
            </td>
            <td class="text-caption">{{ product.quantity }}</td>
            <td>
              <span
                class="px-2 py-1 rounded-lg text-caption"
                :class="[items.isPaid ? 'bg-success' : 'bg-error']"
              >
                {{ items.isPaid ? '已付款' : '未付款' }}</span
              >
            </td>
            <td class="text-caption">{{ items.note }}</td>
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
      <v-card-item class="bg-primary text-center pb-2" title="訂單明細"></v-card-item>
      <v-card-text>
        <div class="order-list-area px-4">
          <div
            v-for="orderItem in systemOrderStore.activeOrderList.items"
            :key="orderItem.product._id"
            class="order-item d-flex align-center"
          >
            <div class="order-item_name font-weight-bold">
              {{ orderItem.product.name }}

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
