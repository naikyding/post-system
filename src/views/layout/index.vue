<script setup>
import { useLayout } from './useLayout'
const {
  state,
  dialog,
  rules,
  goDashboard,
  sidebarClose,
  dialogCancel,
  dialogSubmit,
  systemOrderStore,
  passwordInput,
  passwordForm,
  userStore,
} = useLayout()
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
            @click="goDashboard"
            prepend-icon="mdi-chart-box-outline"
            title="Home"
            value="home"
          ></v-list-item>
          <!-- 點餐 -->
          <v-list-item to="/order" prepend-icon="mdi-plus-box-outline" title="Order" value="order">
          </v-list-item>
          <!-- 訂單狀態 -->
          <v-list-item to="/order-status" title="List" value="list">
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

          <v-list-group prepend-icon="mdi-cog" value="setting">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Setting"></v-list-item>
            </template>
            <v-list-item prepend-icon="mdi-food-fork-drink" title="Products" to="/setting/products">
            </v-list-item>
            <v-list-item prepend-icon="mdi-sitemap" title="Menus" to="/setting/menus"></v-list-item>
            <v-list-item
              prepend-icon="mdi-shield-account"
              title="Roles"
              to="/setting/roles"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-account-group"
              title="User"
              to="/setting/user"
            ></v-list-item>
          </v-list-group>
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

      <!-- 請輸入密碼 -->
      <template>
        <div class="text-center">
          <v-btn color="primary" @click="dialog = true"> Open Dialog </v-btn>

          <v-dialog v-model="dialog" width="360">
            <v-card class="py-2 rounded-lg">
              <v-card-title class="px-6">登錄密碼</v-card-title>
              <v-card-text>
                <v-form ref="passwordForm" @submit.prevent>
                  <v-text-field
                    type="password"
                    @keyup.enter="dialogSubmit"
                    v-model="passwordInput"
                    label="請輸入密碼"
                    variant="outlined"
                    :rules="rules.password"
                  ></v-text-field>
                </v-form>

                <div class="d-flex flex-column">
                  <v-btn size="large" color="success" class="mt-2" block @click="dialogSubmit"
                    >送出</v-btn
                  >
                  <v-btn size="large" color="error" class="mt-4" block @click="dialogCancel">
                    取消
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
      </template>

      <!-- 內容 (右) -->
      <v-main @click="sidebarClose">
        <RouterView />
      </v-main>
    </v-layout>
  </v-card>
</template>

<style>
.swal2-container {
  z-index: 2500;
}
</style>
