<script setup>
import { useSystemOrderList } from '../stores/orders'
const systemOrderStore = useSystemOrderList()

systemOrderStore.getOrderList()
</script>

<template>
  <v-table fixed-header height="100dvh">
    <thead>
      <tr class="text-caption">
        <th class="text-left">執行狀態</th>
        <th class="text-left">項目</th>
        <th class="text-left">OrderID</th>
        <th class="text-left">商品名稱</th>
        <th class="text-left">加料</th>
        <th class="text-left">數量</th>
        <th class="text-left">付款狀態</th>
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
          <td class="text-caption">{{ product._id.substring(product._id.length - 4) }}</td>
          <td>
            {{ product.product.name }}
          </td>
          <td class="text-caption">
            <div v-for="extra in product.extras" :key="extra._id">
              +<span class="bg-grey px-1 rounded-lg mx-1">{{ extra.type }}</span>
              <span>{{ extra.name }}</span>
            </div>
          </td>
          <td class="text-caption">{{ product.quantify }}</td>
          <td>
            <span
              class="px-2 py-1 rounded-lg text-caption"
              :class="[items.isPaid ? 'bg-success' : 'bg-error']"
            >
              {{ items.isPaid ? '已付款' : '未付款' }}</span
            >
          </td>
          <td class="text-center">
            <v-btn size="x-small" icon="mdi-dots-vertical" variant="text"> </v-btn>
          </td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>

<style lang="scss" scoped></style>
