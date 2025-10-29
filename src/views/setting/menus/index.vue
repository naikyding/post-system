<script setup>
import { ref } from 'vue'
import menuTable from './components/menuTable.vue'
import formDialog from './components/formDialog.vue'
import confirmDialog from './components/confirmDialog.vue'

import { useMenus } from './useMenus'

const menuTableRef = ref(null)
const formDialogRef = ref(null)
const confirmDialogRef = ref(null)

const { menuStore } = useMenus({ formDialogRef, confirmDialogRef, menuTableRef })
</script>

<template>
  <div>
    <div style="height: 100dvh">
      <h3 class="pa-4 pb-0">選單設定</h3>
      <menuTable :menus="menuStore.menus" ref="menuTableRef" />
    </div>
    <formDialog ref="formDialogRef" />
    <confirmDialog ref="confirmDialogRef" />
  </div>
</template>

<style lang="scss" scoped></style>
