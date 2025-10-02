<script setup>
import { onMounted, ref } from 'vue'
import menuTable from './components/menuTable.vue'
import operationFormDialog from './components/operationFormDialog.vue'
import { useMenus } from './useMenus'

const menuTableRef = ref(null)
const operationFormDialogRef = ref(null)

const { menuStore } = useMenus(operationFormDialogRef)

onMounted(() => {
  // operationFormDialogRef.value.status = true
})
</script>

<template>
  <div style="height: 100dvh">
    <h3 class="pa-4 pb-0">選單設定</h3>
    <menuTable :menus="menuStore.menus" ref="menuTableRef" />
  </div>
  <operationFormDialog ref="operationFormDialogRef" />
</template>

<style lang="scss" scoped></style>
