<script setup></script>

<template>
  <div class="d-flex justify-center align-center">
    <div>
      <v-icon icon="mdi-dropbox" size="5rem" />
      <p class="text-caption text-center mt-4">
        <slot name="text">沒有資料</slot>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
