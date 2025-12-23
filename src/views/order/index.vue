<script setup>
import { useOrder } from './useOrder'

const {
  display,
  tabActiveId,
  submitList,
  setScheduleDateDone,
  cancelScheduleDateNTime,
  showScheduleDialog,
  rules,
  activeProductItems,
  activeProducts,
  dialog,
  computedDialog,
  ordersStore,
  productsStore,
  markerStore,
  parseDate,
  schedule,
  cancelSettingDateAndTime,
  resetCart,
} = useOrder()

function stashOrderList() {
  ordersStore.stashLocalOrderList()
  dialog.confirmOrderList = false
}
</script>

<template>
  <div>
    <v-container
      fluid
      class="ma-0 pa-0 d-flex flex-column"
      :style="{ height: 'calc(100dvh - 48px)' }"
    >
      <v-row class="ma-0 pa-0 flex-1">
        <!-- 點單項目 -->
        <v-col cols="5" md="4" class="order-area px-0 d-flex flex-column bg-grey-darken-3">
          <!-- 操作 -->
          <v-container class="py-0 px-2">
            <v-row dense>
              <v-col cols="6">
                <!-- 暫存 -->
                <v-btn
                  :disabled="ordersStore.ordersList.items.length < 1"
                  block
                  class="mx-1"
                  variant="tonal"
                  @click="stashOrderList"
                >
                  <v-icon icon="mdi-tray-arrow-down" />
                </v-btn>
              </v-col>
              <v-col cols="6">
                <!-- 清空購物車 -->
                <v-btn
                  :disabled="ordersStore.ordersList.items.length < 1"
                  block
                  color="error"
                  variant="flat"
                  @click="resetCart"
                >
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
              <v-container v-show="ordersStore.ordersList.items.length > 0" class="bg-black">
                <v-row
                  v-for="(item, index) in ordersStore.ordersList.items"
                  :key="index"
                  no-gutters
                  class="c-pointer"
                  @click="ordersStore.editOrderItem(ordersStore.ordersList, item, dialog, true)"
                >
                  <v-col cols="12" sm="7" class="py-2">
                    <!-- 產品名稱 -->
                    <div class="product-name font-weight-bold">
                      {{ item.product.name }}
                      <span class="text-caption"> ${{ item.product.price }} </span>
                    </div>

                    <!-- 加料 -->
                    <div class="special">
                      <span
                        v-for="(extra, index) in item.extras"
                        :key="extra.extraItem._id"
                        class="text-caption"
                        color="error"
                      >
                        {{ extra.extraItem.name }}x{{ extra.quantity }} (${{ extra.price }})
                        <span v-if="index + 1 !== item.extras.length"> / </span>
                      </span>
                    </div>

                    <div class="mark">
                      <v-chip v-for="marker in item.markers" class="ma-1" :key="marker._id">
                        {{ marker.name }}
                      </v-chip>
                    </div>

                    <div class="notes">
                      <v-chip v-show="item.notes" color="warning" prepend-icon="mdi-lead-pencil">
                        {{ item.notes }}
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="5"
                    class="d-flex flex-column flex-lg-row align-center justify-center justify-lg-space-between py-2"
                  >
                    <div class="d-flex align-center justify-center">
                      <!-- 減少 -->
                      <v-btn
                        @click.stop="
                          ordersStore.orderItemQuantityPlusOrMinus(
                            'minus',
                            ordersStore.ordersList,
                            item,
                          )
                        "
                        density="compact"
                        color="error"
                        :icon="item.quantity > 1 ? 'mdi-minus' : 'mdi-delete-outline'"
                      >
                      </v-btn>

                      <span class="mx-2 text-h6 font-weight-bold text-white">
                        {{ item.quantity }}
                      </span>

                      <!-- 增加 -->
                      <v-btn
                        @click.stop="
                          ordersStore.orderItemQuantityPlusOrMinus(
                            'plus',
                            ordersStore.ordersList.items,
                            item,
                          )
                        "
                        density="compact"
                        color="success"
                        icon="mdi-plus"
                      ></v-btn>
                    </div>

                    <!-- 小計 -->
                    <div class="product-total text-center font-weight-bold text-h6">
                      $ {{ item.total }}
                    </div>
                  </v-col>
                  <v-divider
                    v-show="index + 1 !== ordersStore.ordersList.items.length"
                    class="my-2"
                  />
                </v-row>
              </v-container>
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
              <div class="d-flex flex-sm-row my-1">
                <v-spacer />

                <p class="text-h4 font-italic font-weight-bold">
                  <span class="text-h6">$</span>
                  {{ ordersStore.ordersList.total.totalPrice }}
                </p>
              </div>

              <!-- 送出訂單 -->
              <div>
                <v-btn
                  :disabled="ordersStore.ordersList.items.length < 1"
                  block
                  size="x-large"
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
          class="order-type bg-grey-darken-3 pa-0 overflow-x-hidden overflow-y-auto d-flex flex-column"
          :style="{ height: 'calc(100dvh - 48px)' }"
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
              v-for="(productItems, index) in activeProducts(productsStore.products)"
              :key="productItems + index"
              :value="index"
              class="text-subtitle-1"
            >
              {{ productItems.type }}
            </v-tab>
          </v-tabs>

          <!-- 產品列表 -->
          <div class="h-0">
            <v-window continuous v-model="tabActiveId">
              <v-window-item
                v-for="(productItems, index) in activeProducts(productsStore.products)"
                :key="productItems + index"
                :value="index"
                class="pa-1"
              >
                <v-container>
                  <v-row>
                    <!-- 產品項目 -->
                    <v-col
                      v-for="(productItem, index) in activeProductItems(productItems.items)"
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
                        <v-btn
                          class="fast-add-item-btn"
                          @click.stop="
                            ordersStore.fashAddActiveProductItemToOrdersList(
                              ordersStore.ordersList,
                              productItem,
                              dialog,
                            )
                          "
                          icon="mdi-plus"
                          variant="tonal"
                          color="success"
                        >
                        </v-btn>
                        <!-- 快捷新增按鈕 (含提袋) -->

                        <v-btn
                          v-show="productItem.type !== '塑膠提袋'"
                          class="fast-add-item-and-sack-btn"
                          @click.stop="
                            ordersStore.fashAddActiveProductItemToOrdersList(
                              ordersStore.ordersList,
                              productItem,
                              dialog,
                              '64cf45d1ee6af4dc14dcb456',
                            )
                          "
                          icon="mdi-shopping"
                          variant="tonal"
                          color="warning"
                        >
                        </v-btn>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-window-item>
            </v-window>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- 產品資訊 Dialog -->
    <v-dialog
      v-model="dialog.activeProductItem"
      transition="dialog-bottom-transition"
      :width="display.xs.value ? null : 640"
      :fullscreen="display.xs.value"
      scrollable
    >
      <v-card>
        <v-toolbar dark prominent>
          <v-toolbar-title> {{ ordersStore.activeProductItem.product.name }} </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon @click="dialog.activeProductItem = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-subtitle class="px-6 mt-4 d-flex align-center">
          <span class="me-auto">
            {{ ordersStore.activeProductItem.product.description }}
          </span>
        </v-card-subtitle>

        <v-divider class="mt-4" />

        <v-card-text class="py-6">
          <!-- 加料 -->
          <div v-if="ordersStore.activeProductItem.product?.extras?.length > 0">
            <h4 class="mb-4">特製</h4>

            <div>
              <v-expansion-panels
                v-for="extras in ordersStore.activeProductItem.product.extras"
                :key="extras"
                :model-value="ordersStore.activeProductItem.extrasTypeOpen"
                variant="accordion"
                multiple
              >
                <v-expansion-panel
                  rounded
                  :bg-color="extras.type === '加購' ? 'warning' : '#2e2e2e'"
                  class="my-2"
                  :value="extras.type"
                >
                  <v-expansion-panel-title expand-icon="mdi-menu-down">
                    <span class="text-subtitle-1"> {{ extras.type }} </span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div v-for="(extra, index) in extras.items" :key="extra">
                      <div class="d-flex py-4 align-center">
                        <!-- 數量 -->
                        <div class="quantity mr-2 d-flex align-center">
                          <div
                            class="align-center"
                            :class="[
                              ordersStore.activeProductItem.form.extras.find(
                                (item) => item.extraItem._id === extra._id,
                              )?.quantity > 0
                                ? 'd-flex'
                                : 'd-none',
                            ]"
                          >
                            <!-- 減少 -->
                            <v-btn
                              @click="
                                ordersStore.operationExtrasQuantity(
                                  'minus',
                                  ordersStore.activeProductItem.form,
                                  extra,
                                )
                              "
                              density="compact"
                              color="error"
                              :icon="
                                ordersStore.activeProductItem.form.extras.find(
                                  (item) => item.extraItem._id === extra._id,
                                )?.quantity > 1
                                  ? 'mdi-minus'
                                  : 'mdi-delete-outline'
                              "
                            ></v-btn>

                            <span class="text-h6 mx-2">
                              {{
                                ordersStore.activeProductItem.form.extras.find(
                                  (item) => item.extraItem._id === extra._id,
                                )?.quantity
                              }}
                            </span>
                          </div>

                          <!-- 增加 -->
                          <v-btn
                            @click="
                              ordersStore.operationExtrasQuantity(
                                'plus',
                                ordersStore.activeProductItem.form,
                                extra,
                              )
                            "
                            density="compact"
                            color="success"
                            icon="mdi-plus"
                          ></v-btn>
                        </div>
                        <!-- 名稱 -->
                        <div
                          class="extra-name"
                          :class="[
                            {
                              'c-pointer':
                                (ordersStore.activeProductItem.form.extras.find(
                                  (item) => item.extraItem._id === extra._id,
                                )?.quantity || 0) < 1,
                            },
                          ]"
                          @click="
                            ordersStore.activeProductItem.form.extras.find(
                              (item) => item.extraItem._id === extra._id,
                            )?.quantity > 0
                              ? null
                              : ordersStore.operationExtrasQuantity(
                                  'plus',
                                  ordersStore.activeProductItem.form,
                                  extra,
                                )
                          "
                        >
                          <span class="font-weight-bold">
                            {{ extra.name }}
                          </span>
                          <span class="text-caption ml-1">(NT${{ extra.price }})</span>
                        </div>
                        <v-spacer></v-spacer>
                        <!-- 價錢 -->
                        <div class="extras-total text-subtitle-1 font-weight-bold">
                          +{{
                            ordersStore.activeProductItem.form.extras.find(
                              (item) => item.extraItem._id === extra._id,
                            )?.price || 0
                          }}
                        </div>
                      </div>
                      <v-divider v-show="index + 1 !== extras.items.length"></v-divider>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
          <div class="markers mt-4 mb-1">
            <v-select
              v-model="ordersStore.activeProductItem.markers"
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
          </div>

          <div class="notes">
            <v-textarea
              v-model="ordersStore.activeProductItem.notes"
              label="備註"
              variant="outlined"
            ></v-textarea>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <!-- 數量 -->
        <div class="px-6 py-4">
          <v-text-field
            class="mb-4"
            v-model.number="ordersStore.activeProductItem.quantity"
            @click:append="ordersStore.activeProductItemQuantity(true)"
            @click:prepend="ordersStore.activeProductItemQuantity()"
            @update:modelValue="rules.activeProductItemQuantity.check"
            :rules="[rules.activeProductItemQuantity.required, rules.activeProductItemQuantity.min]"
            append-icon="mdi-plus"
            prepend-icon="mdi-minus"
            min="1"
            variant="outlined"
            hide-details
          />

          <!-- 操作功能 -->
          <div class="operate mb-2">
            <!-- 新增 n 到訂單 btn -->
            <v-btn
              size="x-large"
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
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- 訂單明細 Dialog -->
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="dialog.confirmOrderList"
      :width="display.xs.value ? null : 640"
      :fullscreen="display.xs.value"
      scrollable
    >
      <v-card>
        <v-card-item class="text-primary text-center pb-2 p-relative" title="訂單明細">
          <div class="operation-area">
            <!-- 客製訂單時間 -->
            <v-btn
              class="mx-1"
              size="small"
              icon="mdi-clock-outline"
              variant="tonal"
              @click="showScheduleDialog"
            >
            </v-btn>
          </div>

          <!-- 客製訂單時間 dialog -->
          <v-dialog v-model="dialog.scheduleAt" width="400">
            <v-card class="px-3" max-width="400" prepend-icon="mdi-clock-outline" title="設定時間">
              <!-- 日期選擇器 -->
              <v-text-field
                v-model="parseDate"
                :active="schedule.dateModal"
                :focused="schedule.dateModal"
                label="日期"
                variant="outlined"
                readonly
              >
                <v-dialog v-model="schedule.dateModal" activator="parent" width="auto">
                  <v-card>
                    <v-date-picker v-model="schedule.date"></v-date-picker>
                    <template v-slot:actions>
                      <v-btn
                        color="error"
                        class="ms-auto"
                        text="cancel"
                        variant="outlined"
                        @click="cancelScheduleDateNTime(schedule, 'date')"
                      ></v-btn>
                      <v-btn
                        class="ml-2"
                        color="success"
                        text="SAVE"
                        variant="tonal"
                        @click="schedule.dateModal = false"
                      ></v-btn>
                    </template>
                  </v-card>
                </v-dialog>
              </v-text-field>

              <!-- 時間選擇器 -->
              <v-text-field
                v-model="schedule.time"
                :active="schedule.timeModal"
                :focused="schedule.timeModal"
                readonly
                label="時間"
                variant="outlined"
              >
                <v-dialog v-model="schedule.timeModal" activator="parent" width="auto">
                  <v-card>
                    <v-time-picker
                      v-if="schedule.timeModal"
                      v-model="schedule.time"
                      format="24hr"
                      scrollable
                    >
                      <template v-slot:actions>
                        <v-btn
                          color="error"
                          class="ms-auto"
                          text="cancel"
                          variant="outlined"
                          @click="cancelScheduleDateNTime(schedule, 'time')"
                        ></v-btn>
                        <v-btn
                          class="ml-2"
                          color="success"
                          text="SAVE"
                          variant="tonal"
                          @click="schedule.timeModal = false"
                        ></v-btn>
                      </template>
                    </v-time-picker>
                  </v-card>
                </v-dialog>
              </v-text-field>

              <template v-slot:actions>
                <v-btn
                  class="mb-4"
                  color="error"
                  variant="tonal"
                  text="取消"
                  @click="cancelSettingDateAndTime"
                ></v-btn>
                <v-btn
                  class="mb-4"
                  color="success"
                  variant="tonal"
                  text="完成"
                  @click="setScheduleDateDone"
                ></v-btn>
              </template>
            </v-card>
          </v-dialog>

          <v-btn class="close-btn" @click="dialog.confirmOrderList = !dialog.confirmOrderList" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text>
          <div class="order-list-area">
            <div
              v-for="orderItem in ordersStore.ordersList.items"
              :key="orderItem.product._id"
              class="order-item d-flex align-center"
            >
              <div class="order-item_name font-weight-bold">
                <span>
                  {{ orderItem.product.name }}
                </span>
                <span class="text-caption"> ${{ orderItem.product.price }} </span>

                <!-- 加料 -->
                <div class="special">
                  <div
                    v-for="extra in orderItem.extras"
                    :key="extra.extraItem._id"
                    class="text-caption"
                    color="error"
                  >
                    <v-icon> mdi-plus-circle </v-icon>
                    {{ extra.extraItem.name }}x{{ extra.quantity }} (${{ extra.price }})
                  </div>
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
              <div class="order-item_quantity mr-4">{{ orderItem.quantity }}</div>
              <div class="order-item_total-price">
                $
                <span class="font-weight-bold"> {{ orderItem.total }} </span>
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
              <v-combobox
                v-model="ordersStore.ordersList.note"
                :items="['LINE']"
                label="備註"
                variant="outlined"
                clearable
                multiple
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item @click="props.onClick">
                    <v-chip color="green" variant="flat" label>{{ item.title }}</v-chip>
                  </v-list-item>
                </template>
              </v-combobox>
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
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-container class="pt-2">
          <v-row class="px-2">
            <!-- 已付款 -->
            <v-col cols="12" class="">
              <v-btn
                size="x-large"
                block
                variant="flat"
                color="blue"
                @click="
                  ordersStore.submitOrderList({
                    list: ordersStore.ordersList,
                    isPaid: true,
                    paymentType: 'cash',
                    dialog,
                  })
                "
              >
                <span class="px-2 py-1 bg-white rounded mr-2">現金</span>
                已支付
              </v-btn>
            </v-col>

            <!-- LINE PAY 已付款 -->
            <v-col class="py-1">
              <v-btn
                size="x-large"
                block
                variant="flat"
                color="success"
                @click="
                  ordersStore.submitOrderList({
                    list: ordersStore.ordersList,
                    isPaid: true,
                    paymentType: 'Line Pay',
                    dialog,
                  })
                "
              >
                <span class="px-2 py-1 bg-white rounded mr-2">LINE Pay</span>
                已支付
              </v-btn>
            </v-col>

            <!-- 未付款 -->
            <v-col cols="12" class="">
              <v-btn
                color="error"
                size="x-large"
                @click="
                  submitList({
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
      </v-card>
    </v-dialog>

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
              {{ ordersStore.ordersList.total.totalPrice }}
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
  </div>
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

.p-relative {
  position: relative;
}
.close-btn {
  position: absolute;
  top: 4px;
  right: 1rem;
}
.operation-area {
  position: absolute;
  top: 4px;
  left: 1rem;
}

.c-pointer {
  cursor: pointer;
}
</style>
