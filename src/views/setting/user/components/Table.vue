<script setup>
import { useUserStore } from '@/stores/user'
import { inject, ref } from 'vue'
import { dateFormat } from '@/utils/day'
import { useTable } from './useTable'

const user = inject('user')
const { getRoles, headers } = useTable()
const userStore = useUserStore()
const search = ref('')
</script>

<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="search"
        class="mb-4"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>

      <v-btn block color="success" @click="user.openFormDialog({ model: 'create' })">
        <v-icon size="30">mdi-plus</v-icon>
      </v-btn>

      <v-data-table
        :headers="headers"
        :items="userStore.list"
        :search="search"
        density="compact"
        fixed-header
        hide-default-footer
        hover
      >
        <template v-slot:item.nickname="{ value }">
          <span class="font-weight-black">{{ value }}</span>
        </template>

        <template v-slot:item.email="{ value }">
          <v-chip variant="tonal" size="x-small"> {{ value }} </v-chip>
        </template>

        <template v-slot:item.agentRoles="{ value }">
          <v-chip
            variant="outlined"
            color="cyan"
            size="small"
            v-for="item in getRoles(value)"
            :key="item._id"
          >
            {{ item.name }}
          </v-chip>
        </template>

        <template v-slot:item.createdAt="{ value }">
          <span class="text-caption">{{ dateFormat(value) }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <!-- 修改 -->
          <v-btn
            icon="mdi-pencil"
            size="40"
            variant="plain"
            color="warning"
            @click="user.openFormDialog({ model: 'update', userItem: item })"
          ></v-btn>
          <!-- 刪除 -->
          <v-btn
            @click="user.openConfirmDialog({ model: 'delete', id: item._id })"
            icon="mdi-delete"
            size="40"
            variant="plain"
            color="error"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
