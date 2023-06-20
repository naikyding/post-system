<script setup>
import { ref } from 'vue'

const valid = ref(false)
</script>

<template>
  <div class="h-screen d-flex justify-center align-center">
    <v-form class="w-360px text-center px-4" v-model="valid">
      <h2 class="mb-4">系統登入</h2>

      <!-- 帳號 -->
      <v-text-field
        type="text"
        prepend-inner-icon="mdi-account"
        label="帳號"
        variant="solo-filled"
        clearable
      ></v-text-field>

      <!-- 密碼 -->
      <v-text-field
        type="password"
        label="密碼"
        prepend-inner-icon="mdi-lock"
        variant="solo-filled"
        clearable
      ></v-text-field>

      <!-- 登入 -->
      <v-btn color="primary" :disabled="valid" type="submit" size="x-large" block>登入</v-btn>
    </v-form>
  </div>
</template>

<style lang="scss" scoped>
.w-360px {
  width: 360px;
}
</style>
