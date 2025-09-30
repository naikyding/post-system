<script setup>
import menuTable from './components/menuTable.vue'
import { useMenus } from './useMenus'

const { menuStore } = useMenus()
</script>

<template>
  <h3 class="ma-4 mb-0">選單設定</h3>

  <menuTable :menus="menuStore.menus" />
</template>

<style lang="scss" scoped></style>
