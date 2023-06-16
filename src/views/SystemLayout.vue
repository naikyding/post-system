<script setup>
import { ref } from 'vue'
import monsterLogo from '@/assets/images/ci/monster-crepes-ci.jpeg'

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
          <v-list-item to="/" prepend-icon="mdi-home" title="Home" value="home"></v-list-item>
          <!-- 點餐 -->
          <v-list-item to="/post" prepend-icon="mdi-food" title="Order" value="order">
          </v-list-item>
          <!-- 訂單狀態 -->
          <v-list-item to="/list-status" title="List" value="list">
            <!-- 圖示 -->
            <template v-slot:prepend>
              <v-badge offset-x="-5" offset-y="-8" color="red" content="N" class="mr-8">
                <v-icon class="">mdi-list-status</v-icon>
              </v-badge>
            </template>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- 內容 (右) -->
      <v-main @click="sidebarClose">
        <slot />
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped></style>
