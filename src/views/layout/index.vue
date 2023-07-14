<script setup>
import { ref } from 'vue'
import monsterLogo from '@/assets/images/ci/monster-crepes-ci.jpeg'
import { useUserStore } from '../../stores/users'
import { useSystemOrderList } from '@/stores/orders'

const systemOrderStore = useSystemOrderList()
systemOrderStore.getTodayOrderList()

const userStore = useUserStore()
const state = ref({
  drawer: true,
  items: [
    { title: 'Home', icon: 'mdi-home-city' },
    { title: 'My Account', icon: 'mdi-account' },
    { title: 'Users', icon: 'mdi-account-group-outline' },
  ],
  rail: true,
})

function sidebarClose() {
  if (state.value.rail) return false
  state.value.rail = true
}
</script>

<template>
  <!-- <img src="@/assets/images/ci/monster-crepes-ci.jpeg" /> -->
  <v-card>
    <v-layout>
      <!-- sidebar 側邊欄 -->
      <v-navigation-drawer
        width="220"
        v-model="state.drawer"
        :rail="state.rail"
        permanent
        @click="state.rail = false"
      >
        <v-list-item
          @click.stop="state.rail = !state.rail"
          prepend-avatar="null"
          title="Monster Crepes"
          nav
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="state.rail = !state.rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <!-- 首頁 -->
          <v-list-item
            to="/dashboard"
            prepend-icon="mdi-chart-box-outline"
            title="Home"
            value="home"
          ></v-list-item>
          <!-- 點餐 -->
          <v-list-item to="/post" prepend-icon="mdi-plus-box-outline" title="Order" value="order">
          </v-list-item>
          <!-- 訂單狀態 -->
          <v-list-item to="/list-status" title="List" value="list">
            <!-- 圖示 -->
            <template v-slot:prepend>
              <v-badge
                v-show="systemOrderStore.pendingQuantity > 0"
                offset-x="-5"
                offset-y="-8"
                color="red"
                :content="systemOrderStore.pendingQuantity"
                class="mr-8"
              >
                <v-icon class="">mdi-list-status</v-icon>
              </v-badge>

              <v-icon v-show="systemOrderStore.pendingQuantity < 1">mdi-list-status</v-icon>
            </template>
          </v-list-item>
        </v-list>

        <!-- 登出 -->
        <template v-slot:append>
          <div>
            <v-list-item
              @click="userStore.logoutFunc('/login')"
              prepend-icon="mdi-logout"
              title="Logout"
              value="logout"
            >
            </v-list-item>
          </div>
        </template>
      </v-navigation-drawer>

      <!-- 內容 (右) -->
      <v-main @click="sidebarClose">
        <RouterView />
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped></style>
