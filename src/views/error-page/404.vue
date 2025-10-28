<template>
  <v-row align="center" justify="center" :style="{ height: '100dvh' }">
    <v-col class="d-flex justify-center">
      <div>
        <h1 class="text-h3 text-error font-weight-bold mb-4">Whoops, 404</h1>
        <p class="font-weight-bold">此頁面不存在</p>
        <p class="text-caption">The page you were looking for does not exist</p>

        <v-hover v-slot="{ isHovering, props }">
          <v-btn
            to="/"
            v-bind="props"
            :variant="isHovering ? 'elevated' : 'outlined'"
            class="mt-3"
            color="success"
            >回到系統</v-btn
          >
        </v-hover>
      </div>
    </v-col>
  </v-row>
</template>

<script setup></script>

<style lang="scss" scoped></style>
