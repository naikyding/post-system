<script setup>
import { computed, onUpdated, reactive, ref } from 'vue'

const loginForm = ref(null)
const form = reactive({
  // 表單狀態
  valid: false,

  account: '',
  password: '',

  // 驗証條件
  rules: {
    account: [(account) => !!account || '請輸入帳號'],
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
        v-model="form.account"
        :rules="form.rules.account"
        type="text"
        label="帳號"
        prepend-inner-icon="mdi-account"
        variant="solo-filled"
        clearable
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
      ></v-text-field>

      <!-- 登入 -->
      <v-btn color="primary" :disabled="!form.valid" type="submit" size="x-large" block>登入</v-btn>
    </v-form>
  </div>
</template>

<style lang="scss" scoped>
.w-360px {
  width: 360px;
}
</style>
