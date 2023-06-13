<script setup>
import { reactive } from 'vue'
import { useSystemOrderList } from '../stores/orders'
import { dateFormat } from '@/utils/day'
import Swal from 'sweetalert2'

const systemOrderStore = useSystemOrderList()
systemOrderStore.getOrderList()

const dialog = reactive({
  confirmOrderList: false,
})

function showOrderListDetails(order) {
  systemOrderStore.addActiveOrderList(order)
  dialog.confirmOrderList = true
}

async function deleteDialog(orderListID, callback) {
  dialog.confirmOrderList = false

  const { isConfirmed } = await Swal.fire({
    title: '確定刪除訂單內容?',
    showCancelButton: true,
    confirmButtonText: '確定刪除',
    confirmButtonColor: '#dc3741',
    cancelButtonText: '取消',
  })

  if (isConfirmed) {
    return callback(orderListID)
  }

  console.log('取消')
}
</script>

<template>
  <v-table fixed-header height="100dvh">
    <thead>
      <tr class="text-caption">
        <th class="text-left">執行狀態</th>
        <th class="text-left">項目</th>
        <th class="text-left">時間</th>
        <th class="text-left">商品名稱</th>
        <th class="text-left">加料</th>
        <th class="text-left">數量</th>
        <th class="text-left">付款狀態</th>
        <th class="text-left">備註</th>
        <th class="text-center">-</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="items in systemOrderStore.orderList" :key="items._id">
        <tr v-for="(product, index) in items.items" :key="product._id">
          <td>
            <v-switch
              @change="
                systemOrderStore.updateProductItemStatus(product.product._id, product.status)
              "
              hide-details
              color="success"
              v-model="product.status"
              :label="`${product.status ? '完成' : '未完成'}`"
            ></v-switch>
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

  <!-- confirm Dialog -->
  <v-dialog transition="dialog-bottom-transition" v-model="dialog.confirmOrderList" width="400">
    <v-card>
      <v-card-item class="bg-grey text-center pb-2" title="訂單明細"></v-card-item>
      <v-card-text>
        <div class="order-list-area px-4">
          <div
            v-for="orderItem in systemOrderStore.activeOrderList.items"
            :key="orderItem.product._id"
            class="order-item d-flex align-center"
          >
            <div class="order-item_name font-weight-bold">
              <v-btn
                @click="deleteDialog(orderItem._id, systemOrderStore.deleteOrderItemById)"
                size="x-small"
                icon="mdi-trash-can-outline"
                class="mr-2"
                color="error"
              ></v-btn>
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
                {{ orderItem.price }}
              </span>
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
        </div></v-card-text
      >

      <template #actions>
        <v-container class="pt-0">
          <v-row class="px-6">
            <v-col cols="12" class="px-1">
              <v-btn size="large" block variant="flat" color="success">
                所有項目完成，更新訂單狀態
              </v-btn>
            </v-col>

            <v-col cols="12" class="px-1">
              <v-btn
                @click="
                  deleteDialog(
                    systemOrderStore.activeOrderList._id,
                    systemOrderStore.deleteOrderById,
                  )
                "
                size="large"
                color="error"
                block
                variant="outlined"
                >刪除訂單所有項目</v-btn
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
</style>
