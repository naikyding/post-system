<script setup>
import { ref, computed, onMounted } from 'vue'

const orderItem = ref([])

for (let i = 0; i < 20; i++) {
  orderItem.value.push({
    _id: i,
    name: `國國國國國-${i}`,
    price: i * 100,
    quantity: 1,
    special: ['A', 'B', 'C'],
  })
}

const subTotal = computed(() => orderItem.value.reduce((acc, cur) => (acc += cur.price), 0))
const service = computed(() => 0)
const discount = computed(() => 0)
const total = computed(() => subTotal.value + service.value + discount.value)

onMounted(() => {
  const orderItemEl = document.querySelectorAll('.order-item')

  const startPageX = ref(null)
  const endPageX = ref(null)

  orderItemEl.forEach((item) => {
    item.addEventListener('touchstart', (e) => {
      startPageX.value = e.touches[0].pageX
    })

    item.addEventListener('touchmove', (e) => {
      endPageX.value = e.changedTouches[0].pageX
      console.log(endPageX.value - startPageX.value > 0 ? '向右滑' : '向左滑')
    })
  })
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
              <v-btn block>〇</v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn block>ㄨ</v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn block>△</v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn block>□</v-btn>
            </v-col>
          </v-row>
        </v-container>

        <v-divider class="mt-4"></v-divider>
        <div class="flex-grow-1 d-flex flex-column">
          <!-- 點單項目 -->
          <div class="flex-grow-1 h-0 overflow-y-auto">
            <v-table hover>
              <tbody>
                <tr v-for="item in orderItem" :key="item.name" class="order-item">
                  <td class="py-3 pr-0">
                    <div>
                      {{ item.name }}
                    </div>
                    <div class="special">
                      <span
                        class="text-caption"
                        v-for="(specialItem, index) in item.special"
                        :key="specialItem"
                      >
                        {{ specialItem }}
                        <span v-if="index !== item.special.length - 1">/</span>
                      </span>
                    </div>
                  </td>
                  <td class="text-right px-1">{{ item.quantity }}</td>
                  <td class="text-right pl-1 pr-4">{{ item.price }}</td>
                </tr>
              </tbody>
            </v-table>
            <!-- <div v-for="item in orderItem" :key="item.id">{{ item.name }}</div> -->
          </div>

          <v-divider></v-divider>

          <!-- 數量 -->
          <div class="order-total px-4 py-2 pb-0 text-caption">
            <div class="d-flex">
              <span>數量</span>
              <v-spacer></v-spacer>
              <span>{{ orderItem.length }}</span>
            </div>

            <!-- 小計 -->
            <div class="d-flex">
              <span>小計</span>
              <v-spacer></v-spacer>
              <span>{{ subTotal }}</span>
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
              <span>{{ total }}</span>
            </div>
          </div>
        </div>
      </v-col>

      <!-- 菜單 -->
      <v-col cols="6" md="8" class="order-type bg-grey-darken-3"> </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 5fr 5fr;
  gap: 4px;
}
</style>
