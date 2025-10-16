<script setup>
import { ref } from 'vue'
import Table from './components/Table.vue'
import { useUser } from './useUser.js'

const tableRef = ref(null)
const {} = useUser({ tableRef })
</script>

<template>
  <h3 class="pa-4 pb-0">使用者設定</h3>
  <Table ref="tableRef" />
</template>
