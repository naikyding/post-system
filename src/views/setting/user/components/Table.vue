<script setup>
import { useUserStore } from '@/stores/user'
import { useUserStore as useUsersStore } from '@/stores/users'
import { inject, ref } from 'vue'
import { dateFormat } from '@/utils/day'
import { useTable } from './useTable'

const user = inject('user')
const { getRoles, headers, getAgents } = useTable()
const userStore = useUserStore()
const usersStore = useUsersStore()
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
        :items-per-page="-1"
        hover
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <span class="font-weight-black">{{ item.nickname }}</span>
            </td>
            <td>
              <v-chip variant="tonal" size="x-small"> {{ item.email }} </v-chip>
            </td>
            <td>
              <v-chip
                :style="{ marginRight: '2px' }"
                variant="outlined"
                color="cyan"
                size="small"
                v-for="agentAndRolesItem in getRoles(item.agentRoles)"
                :key="agentAndRolesItem._id"
              >
                {{ agentAndRolesItem.name }}
              </v-chip>
            </td>
            <td>
              <v-chip
                class="ma-1"
                v-for="agent in getAgents(item.agentRoles)"
                :key="agent._id"
                density="compact"
              >
                <v-icon
                  v-show="agent._id === usersStore.activeAgentId"
                  icon="mdi-check-circle-outline"
                  start
                  color="success"
                ></v-icon>
                {{ agent.name }}
              </v-chip>
            </td>
            <td>
              <span class="text-caption">{{ dateFormat(item.createAt) }}</span>
            </td>
            <td>
              <!-- 修改密碼 -->
              <v-btn
                icon="mdi-lock-reset"
                size="40"
                variant="plain"
                color="pink"
                @click="user.openFormDialog({ model: 'password', userItem: item })"
              ></v-btn>

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
                @click="user.openConfirmDialog({ model: 'delete', id: item._id, data: item })"
                icon="mdi-delete"
                size="40"
                variant="plain"
                color="error"
              ></v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
