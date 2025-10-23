<script setup>
import { useLayout } from './useLayout'
import Toolbar from './toolbar/index.vue'

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
  transformMenus,
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
          <template v-for="(route, index) in transformMenus">
            <v-list-group
              v-if="route.children && route.children.length > 0"
              prepend-icon="mdi-cog"
              value="setting"
              :key="route.name + index"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :prepend-icon="route.icon"
                  :title="route.name"
                ></v-list-item>
              </template>

              <!-- 子層 -->
              <v-list-item
                v-for="(child, cIndex) in route.children"
                :key="child.name + cIndex"
                :title="child.name"
                :to="route.path + child.path"
                :prepend-icon="child.icon"
              />
            </v-list-group>

            <v-list-item
              v-else
              :key="route + index"
              :title="route.name"
              :to="route.name === 'Dashboard' ? null : route.path"
              :prepend-icon="route.icon"
              @click="route.name === 'Dashboard' ? goDashboard() : null"
            >
              <template v-slot:prepend v-if="route.name === 'Order-status'">
                <v-badge
                  v-if="systemOrderStore.pendingQuantity > 0"
                  bordered
                  location="top right"
                  color="pink"
                  :offset-x="-3"
                  :offset-y="-3"
                  :content="systemOrderStore.pendingQuantity"
                >
                  <v-icon :icon="route.icon"></v-icon>
                </v-badge>

                <v-icon v-else :icon="route.icon"></v-icon>
              </template>
            </v-list-item>
          </template>
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
      <v-main class="d-flex flex-column" :style="{ height: '100dvh' }" @click="sidebarClose">
        <Toolbar />
        <RouterView class="flex-grow-1" />
      </v-main>
    </v-layout>
  </v-card>
</template>

<style>
.swal2-container {
  z-index: 2500;
}
</style>
