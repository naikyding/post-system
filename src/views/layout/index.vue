<script setup>
import { useLayout } from './useLayout'
import Toolbar from './toolbar/index.vue'
import { useRouterStore } from '@/stores/router'

const routerStore = useRouterStore()

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
  <v-layout :style="{ height: '100dvh' }">
    <!-- sidebar 側邊欄 -->
    <v-navigation-drawer
      v-model="state.drawer"
      :rail="state.rail"
      permanent
      @click="state.rail = false"
    >
      <v-list nav>
        <v-list-item
          :prepend-avatar="userStore?.activeAgentData?.agent?.image"
          :title="userStore?.activeAgentData?.agent.name"
          @click.stop="state.rail = !state.rail"
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
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <template v-for="route in transformMenus">
          <v-list-group
            v-if="route.children && route.children.length > 0"
            prepend-icon="mdi-cog"
            value="setting"
            :key="route._id"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="route.icon"
                :title="route.name"
                :key="route._id"
              ></v-list-item>
            </template>

            <!-- 子層 -->
            <v-list-item
              v-for="child in route.children"
              :title="child.name"
              :to="route.path + child.path"
              :prepend-icon="child.icon"
              :key="child._id"
            />
          </v-list-group>

          <template v-else>
            <v-list-item
              :key="route._id + routerStore.refreshKey"
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
    <v-main class="d-flex flex-column" @click="sidebarClose" :style="{ height: '100dvh' }">
      <Toolbar />
      <RouterView class="flex-grow-1 router-view overflow-y-hidden" />
    </v-main>
  </v-layout>
</template>

<style>
.swal2-container {
  z-index: 2500;
}
</style>
