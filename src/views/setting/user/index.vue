<script setup>
import { useUser } from './useUser'
import Table from './components/Table.vue'

const { userList } = useUser()
</script>

<template>
  <div>USER</div>
  <Table :items="userList" />
</template>
