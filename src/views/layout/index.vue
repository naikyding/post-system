<script setup>
import { ref } from 'vue'
import monsterLogo from '@/assets/images/ci/monster-crepes-ci.jpeg'
import { useUserStore } from '../../stores/users'
import { useSystemOrderList } from '@/stores/orders'
import { watch } from 'vue'
import router from '../../router'

const systemOrderStore = useSystemOrderList()
systemOrderStore.getOrderList('getPendingQuantity')

const userStore = useUserStore()
const state = ref({
  drawer: true,
  items: [
    // { title: 'Home', icon: 'mdi-home-city' },
    // { title: 'My Account', icon: 'mdi-account' },
    // { title: 'Users', icon: 'mdi-account-group-outline' },
  ],
  rail: true,
})

const passwordForm = ref(null)
const dialog = ref(false)
const passwordInput = ref('')
const rules = ref({
  password: [(password) => !!password || '密碼必填'],
})

watch(dialog, (status) => {
  if (!status) resetForm()
})

function goDashboard() {
  dialog.value = true
  // to="/dashboard"
}

function sidebarClose() {
  if (state.value.rail) return false
  state.value.rail = true
}

async function dialogSubmit() {
  const check = await validateForm()
  if (!check) return false
  dialog.value = false
  const res = await userStore.checkPassword({
    email: userStore.baseInfo.email,
    password: passwordInput.value,
  })
  if (res) router.push('/dashboard')
}

function dialogCancel() {
  dialog.value = false
}

async function validateForm() {
  const { valid } = await passwordForm.value.validate()
  if (!valid) return false
  return true
}

function resetForm() {
  passwordForm.value.reset()
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
            @click="goDashboard"
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

          <v-list-item to="/setting" prepend-icon="mdi-cog" title="Setting" value="setting" />
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

<style scoped></style>
