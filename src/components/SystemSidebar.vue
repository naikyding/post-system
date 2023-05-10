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
          <v-list-item to="/" prepend-icon="mdi-home" title="Home" value="home"></v-list-item>
          <v-list-item to="/post" prepend-icon="mdi-food" title="Order" value="order"></v-list-item>
          <v-list-item
            to="/list-status"
            prepend-icon="mdi-list-status"
            title="List"
            value="list"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="" style="height: 100dvh" @click="sidebarClose">
        <slot />
      </v-main>
    </v-layout>
  </v-card>
</template>

<style lang="scss" scoped></style>
