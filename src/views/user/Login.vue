<script setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()
const loginForm = ref(null)
const form = reactive({
  // 表單狀態
  valid: false,

  email: '',
  password: '',

  // 驗証條件
  rules: {
    email: [(email) => !!email || '請輸入 email'],
    password: [(password) => (!password ? '請輸入密碼' : true)],
  },
})
</script>

<template>
  <div class="h-screen d-flex justify-center align-center">
    <v-form ref="loginForm" class="w-360px px-4" v-model="form.valid" @submit.prevent>
      <h2 class="mb-4 text-center">系統登入</h2>

      <!-- 帳號 -->
      <v-text-field
        v-model="form.email"
        :rules="form.rules.email"
        type="text"
        label="電子信箱"
        prepend-inner-icon="mdi-account"
        variant="solo-filled"
        clearable
        @keyup.enter="
          userStore.login({
            email: form.email,
            password: form.password,
          })
        "
      ></v-text-field>

      <!-- 密碼 -->
      <v-text-field
        v-model="form.password"
        :rules="form.rules.password"
        class="my-2"
        type="password"
        label="密碼"
        prepend-inner-icon="mdi-lock"
        variant="solo-filled"
        clearable
        @keyup.enter="
          userStore.login({
            email: form.email,
            password: form.password,
          })
        "
      ></v-text-field>

      <!-- 登入 -->
      <v-btn
        color="primary"
        size="x-large"
        block
        :disabled="!form.valid"
        @click="
          userStore.login({
            email: form.email,
            password: form.password,
          })
        "
        >登入</v-btn
      >
    </v-form>
  </div>
</template>

<style lang="scss" scoped>
.w-360px {
  width: 360px;
}
</style>
