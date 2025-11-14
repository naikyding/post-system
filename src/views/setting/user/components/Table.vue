<script setup>
import { useUserStore } from '@/stores/user'
import { useUserStore as useUsersStore } from '@/stores/users'
import { inject, ref } from 'vue'
import { dateFormat } from '@/utils/day'
import { useTable } from './useTable'
import DotsActionMenu from '@/components/DotsActionMenu.vue'

const user = inject('user')
const { getRoles, headers, getAgents } = useTable()
const userStore = useUserStore()
const usersStore = useUsersStore()
const search = ref('')

const menuItems = [
  {
    title: '修改密碼',
    icon: 'mdi-plus-circle',
    code: 'password',
    event: ({ model, itemData }) => user.openFormDialog({ model, userItem: itemData }),
  },
  { type: 'divider' },
  {
    title: '修改使用者',
    icon: 'mdi-pencil',
    code: 'update',
    event: ({ model, itemData }) => user.openFormDialog({ model, userItem: itemData }),
  },
  { type: 'divider' },
  {
    title: '刪除使用者',
    icon: 'mdi-trash-can',
    code: 'delete',
    event: ({ model, itemData }) =>
      user.openConfirmDialog({ model, id: itemData._id, data: itemData }),
  },
]
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
              <DotsActionMenu :items="menuItems" :id="item._id" :data="item" />
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
