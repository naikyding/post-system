<script setup>
import { useToolbar } from './useToolbar'
const { userData, userStore } = useToolbar()
</script>

<template>
  <v-toolbar density="compact" color="grey-darken-4">
    <template v-slot:prepend> <v-btn icon="mdi-menu"></v-btn> </template>
    <template v-slot:append>
      <v-btn size="small" icon="mdi-bell"> </v-btn>

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
  <v-divider />
</template>

<style lang="scss" scoped></style>
