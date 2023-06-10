<script setup>
import { useSystemOrderList } from '../stores/orders'
const systemOrderStore = useSystemOrderList()

systemOrderStore.getOrderList()
</script>

<template>
  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Calories</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in desserts" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ item.calories }}</td>
      </tr>
    </tbody>
  </v-table>

  {{ systemOrderStore.orderList }}
</template>

<style lang="scss" scoped></style>
