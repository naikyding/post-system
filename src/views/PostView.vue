<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import { useProductStore } from '../stores/product'
const productStore = useProductStore()

// 購物車
const orderList = ref([])

// 口味 tabs
const tab = ref(null)
// 選擇品項 dialog
const selectorDialog = ref(false)

// 清單總計
const orderTotal = computed(() => {
  let quantity = 0
  let subTotal = 0
  let total = 0

  orderList.value.forEach((item) => {
    quantity += item.quantity
    subTotal += item.quantity * item.price
  })
  total = subTotal + service.value - discount.value

  return { quantity, subTotal, total }
})

// 服務費
const service = computed(() => 0)
// 優惠費
const discount = computed(() => 0)

// dialog 選擇項目
const selectedItem = ref({
  item: {},
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

const editMode = ref(false)
const orderListDeleteItem = ref([])

function removeOrderItemFromOrderList(orderList, orderListDeleteItemList) {
  orderListDeleteItemList.forEach((deleteItem) => {
    orderList.splice(orderList.indexOf(deleteItem), 1)
  })
  orderListDeleteItemList.length = 0
}

watch(selectorDialog, (newStatus) => {
  if (!newStatus) resetSelectorForm(selectedItem.value)
})

function resetSelectorForm(selectedItem) {
  selectedItem.item = {}
  selectedItem.extras.length = 0

  selectedItem.quantity = 1
}

function closeSelectorDialog() {
  selectorDialog.value = false
}

function quantityPlus(selectedItem) {
  if (selectedItem.quantity > 5) return false
  selectedItem.quantity++
}

function quantityMinus(selectedItem) {
  if (selectedItem.quantity <= 1) return false
  selectedItem.quantity--
}

async function addOrderItem(list, item, disableDialog) {
  const addItem = {
    item: item.item,
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

function submitOrderList(orderList) {
  return orderList.reduce((acc, cur) => {
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
}

onMounted(() => {
  // const orderItemEl = document.querySelectorAll('.order-item')
  // const startPageX = ref(null)
  // const endPageX = ref(null)
  // orderItemEl.forEach((item) => {
  //   item.addEventListener('touchstart', (e) => {
  //     startPageX.value = e.touches[0].pageX
  //   })
  //   item.addEventListener('touchmove', (e) => {
  //     endPageX.value = e.changedTouches[0].pageX
  //     console.log(endPageX.value - startPageX.value > 0 ? '向右滑' : '向左滑')
  //   })
  // })
})
</script>

<template>
  <v-container fluid class="ma-0 pa-0 h-100">
    <v-row class="ma-0 pa-0 h-100">
      <!-- 點單項目 -->
      <v-col cols="6" md="4" class="order-area bg-grey-darken-3 px-0 d-flex flex-column">
        <!-- 操作 -->
        <v-container class="py-0 px-2">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-btn block @click="editMode = !editMode">
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn>
            </v-col>
            <v-col v-show="orderListDeleteItem.length > 0" cols="12" sm="6">
              <v-btn block @click="removeOrderItemFromOrderList(orderList, orderListDeleteItem)">
                <v-icon icon="mdi-delete"></v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn block color="error" @click="orderList.length = 0">
                <v-icon icon="mdi-delete-empty"></v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>

        <v-divider class="mt-4"></v-divider>

        <div class="flex-grow-1 d-flex flex-column">
          <!-- 點單項目 -->
          <div class="flex-grow-1 h-0 overflow-y-auto">
            <v-table hover>
              <tbody>
                <tr v-for="(item, index) in orderList" :key="item.name" class="order-item">
                  <td class="py-3 pr-0">
                    <div class="d-flex">
                      <!-- addorderListDeleteItem(orderList, index, orderListDeleteItem) -->
                      <v-checkbox
                        v-show="editMode"
                        v-model="orderListDeleteItem"
                        :value="orderList[index]"
                        density="compact"
                        hide-details
                      >
                        <template v-slot:label>
                          {{ item.item.name }}
                        </template>
                      </v-checkbox>

                      <span class="py-2" v-show="!editMode">
                        {{ item.item.name }}
                      </span>
                    </div>
                    <div class="special">
                      <span class="text-caption" v-for="(extra, index) in item.extras" :key="extra">
                        {{ extra.name }}
                        <span v-if="index !== item.extras.length - 1">/</span>
                      </span>
                    </div>
                  </td>
                  <td class="text-right px-1">{{ item.quantity }}</td>
                  <td class="text-right pl-1 pr-4">{{ item.price }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <v-divider></v-divider>

          <!-- 數量 -->
          <div class="order-total px-4 py-2 pb-0 text-caption">
            <div class="d-flex">
              <span>數量</span>
              <v-spacer></v-spacer>
              <span>{{ orderTotal.quantity }}</span>
            </div>

            <!-- 小計 -->
            <div class="d-flex">
              <span>小計</span>
              <v-spacer></v-spacer>
              <span>{{ orderTotal.subTotal }}</span>
            </div>

            <!-- 服務費 -->
            <div class="d-flex">
              <span>服務費</span>
              <v-spacer></v-spacer>
              <span>{{ service }}</span>
            </div>

            <!-- 優惠 -->
            <div class="d-flex">
              <span>優惠費</span>
              <v-spacer></v-spacer>
              <span>{{ discount }}</span>
            </div>

            <v-divider class="my-2"></v-divider>

            <!-- 總價 -->
            <div class="d-flex my-1 text-yellow-accent-4 text-h5">
              <span class="">總價</span>
              <v-spacer></v-spacer>
              <span>{{ orderTotal.total }}</span>
            </div>
          </div>
        </div>
      </v-col>

      <!-- 菜單 -->
      <v-col cols="6" md="8" class="order-type bg-grey-darken-3 pa-0">
        <v-tabs v-model="tab" bg-color="secondary" class="px-6">
          <v-tab
            v-for="(item, index) in productStore.tabsContent.tabs"
            :key="item + index"
            :value="index"
          >
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="tab">
            <v-window-item
              v-for="(items, index) in productStore.tabsContent.content"
              :key="items + index"
              :value="index"
            >
              <v-container>
                <v-row>
                  <v-col
                    v-for="(orderItem, index) in items"
                    :key="orderItem + index"
                    cols="4"
                    class="pa-1"
                  >
                    <v-card @click="selectorFlavors(orderItem, selectedItem)">
                      <template v-slot:title>
                        <div class="d-flex">
                          <div>{{ orderItem.name }}</div>
                          <v-spacer></v-spacer>
                          <button @click.stop="fastAddItem(orderList, orderItem, selectedItem)">
                            <v-icon icon="mdi-lightning-bolt-circle"></v-icon>
                          </button>
                        </div>
                      </template>
                      <template v-slot:text>
                        <div>{{ orderItem.price + '' }}</div>
                      </template>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card-text>

        <div v-show="orderList.length > 0" class="submit-operate px-6 w-100">
          <v-btn @click="submitOrderList(orderList)" block>送出訂單</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Dialog -->
  <v-dialog v-model="selectorDialog" width="400">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
    </template>

    <v-card>
      <v-card-title>{{ selectedItem.item.name }}</v-card-title>
      <v-card-subtitle>口味說明@#$!#$%</v-card-subtitle>
      <v-card-text>
        <div>
          <h4 class="mb-4">加料</h4>

          <div
            class="bg-black rounded-lg py-2 px-4 mb-3"
            v-for="extra in productStore.product.extras"
            :key="extra"
          >
            <p class="font-weight-bold">
              {{ extra.type }}
            </p>
            <v-divider class="my-1"></v-divider>
            <v-checkbox
              density="compact"
              hide-details
              v-for="extras in extra.items"
              :key="extras"
              v-model="selectedItem.extras"
              :label="extras.name + ' +' + extras.price"
              :value="extras"
            >
            </v-checkbox>
          </div>
        </div>

        <h4 class="mb-4">數量</h4>
        <v-text-field
          type="number"
          min="1"
          @click:append="quantityPlus(selectedItem)"
          @click:prepend="quantityMinus(selectedItem)"
          append-icon="mdi-plus"
          prepend-icon="mdi-minus"
          variant="outlined"
          readonly
          v-model="selectedItem.quantity"
        ></v-text-field>

        <div class="operate">
          <v-btn block color="success" @click="addOrderItem(orderList, selectedItem)"
            >新增
            <span class="font-weight-bold text-yellow-accent-4">
              {{ selectedItem.quantity }}
            </span>
            項目到訂單
            <span class="font-weight-bold text-yellow-accent-4">NT${{ selectedItem.price }}</span>
          </v-btn>
          <v-btn block color="error" class="mt-4" @click="closeSelectorDialog">取消</v-btn>
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
</style>
