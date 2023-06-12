<script setup>
import { useSystemOrderList } from '../stores/orders'
const systemOrderStore = useSystemOrderList()

systemOrderStore.getOrderList()
</script>

<template>
  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-left">執行狀態</th>
        <th class="text-left">序號</th>
        <th class="text-left">訂單編號</th>
        <th class="text-left">商品名稱</th>
        <th class="text-left">加料</th>
        <th class="text-left">數量</th>
        <th class="text-left">付款狀態</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="items in systemOrderStore.orderList" :key="items._id">
        <tr v-for="(product, index) in items.items" :key="product._id">
          <td>
            <v-switch
              hide-details
              color="success"
              v-model="product.status"
              :label="`${product.status ? '完成' : '未完成'}`"
            ></v-switch>
          </td>
          <td>
            {{ `${index + 1} / ${items.items.length}` }}
          </td>
          <td>{{ product._id.substring(product._id.length - 4) }}</td>
          <td>
            {{ product.product.name }}
          </td>
          <td class="text-caption">
            <div v-for="extra in product.extras" :key="extra._id">
              +<span class="bg-grey px-1 rounded-lg mx-1">{{ extra.type }}</span>
              <span>{{ extra.name }}</span>
            </div>
          </td>
          <td>{{ product.quantify }}</td>
          <td>
            <span class="px-2 py-1 rounded-lg" :class="[items.isPaid ? 'bg-success' : 'bg-red']">
              {{ items.isPaid ? '已付款' : '未付款' }}</span
            >
          </td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>

<style lang="scss" scoped></style>
