<script setup>
import { useToolbar } from './useToolbar'
const { userData, userStore } = useToolbar()

import { useOrdersStore } from '@/stores/orders'

const ordersStore = useOrdersStore()

// localOrderList
</script>

<template>
  <v-toolbar density="compact" color="grey-darken-4">
    <template v-slot:prepend>
      <span class="px-2">{{ userStore.activeAgentData?.agent?.name }}</span>
    </template>

    <!-- 暫存訂單 -->
    <template v-slot:append>
      <template v-if="ordersStore.localOrderList.length > 0">
        <v-badge
          location="top right"
          color="pink"
          :offset-x="8"
          :offset-y="12"
          bordered
          :content="ordersStore.localOrderList.length"
        >
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-tray-full"></v-btn>
            </template>

            <v-list density="compact">
              <v-list-item
                v-for="(item, index) in ordersStore.localOrderList"
                :value="item"
                :key="index"
              >
                <v-list-item-title>
                  <span
                    class="text-caption px-1"
                    v-for="(productItem, index) in item.items"
                    :key="index"
                    >{{ productItem.product.name }}
                    <span v-if="item.items.length - 1 !== index">/</span>
                  </span>
                </v-list-item-title>

                <template v-slot:append>
                  <v-btn
                    @click="ordersStore.popOrderListItem(item)"
                    class="mx-1"
                    color="success"
                    icon
                    size="28"
                  >
                    <v-icon icon="mdi-tray-arrow-up" size="x-small"></v-icon>
                  </v-btn>
                  <v-btn
                    @click="ordersStore.deleteLocalOrderListItem(item)"
                    class="mx-1"
                    size="28"
                    color="error"
                    icon
                  >
                    <v-icon icon="mdi-delete-outline" size="x-small"></v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-badge>
      </template>

      <template v-else>
        <v-icon class="mr-3">mdi-tray</v-icon>
      </template>
      <!-- 暫存訂單 -->

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">
            <template v-slot:prepend>
              <v-avatar size="32" color="surface-variant">
                <v-img :alt="userData.nickname" :src="userData.avatar"></v-img> </v-avatar
            ></template>
            <span class="text-subtitle-2 font-weight-bold">{{ userData.nickname }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item class="text-subtitle-2" to="/profile">個人中心</v-list-item>
          <v-list-item class="text-subtitle-2" @click="userStore.logoutFunc('/login')"
            >登出</v-list-item
          >
        </v-list>
      </v-menu>

      <v-btn size="small" icon="mdi-dots-vertical"></v-btn
    ></template>
  </v-toolbar>
  <v-divider color="white"></v-divider>
</template>

<style lang="scss" scoped></style>
