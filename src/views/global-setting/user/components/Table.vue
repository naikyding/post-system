<script setup>
import { useUserStore } from '@/stores/user'
import { useUserStore as useUsersStore } from '@/stores/users'
import { inject, ref } from 'vue'
import { dateFormat } from '@/utils/day'
import { useTable } from './useTable'

const user = inject('user')
const { getRoles, headers, getAgents } = useTable()
const usersStore = useUsersStore()
const userStore = useUserStore()
const search = ref('')

const menuItems = [
  { title: '修改密碼', icon: 'mdi-plus-circle', code: 'password' },
  { type: 'divider' },
  { title: '修改使用者', icon: 'mdi-pencil', code: 'update' },
  { type: 'divider' },
  { title: '刪除使用者', icon: 'mdi-trash-can', code: 'delete' },
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
              <v-expansion-panels class="my-2" color="grey-darken-3" variant="accordion" multiple>
                <v-expansion-panel
                  bg-color="grey-darken-4"
                  v-for="agent in getAgents(item.agentRoles)"
                  :key="agent._id"
                  :value="agent._id"
                >
                  <v-expansion-panel-title class="text-caption">
                    <v-icon
                      color="success"
                      class="mr-1"
                      :icon="
                        usersStore.activeAgentId === agent._id ? 'mdi-check-circle-outline' : ''
                      "
                    ></v-icon>
                    {{ agent.name }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-chip
                      :style="{ marginRight: '2px' }"
                      variant="outlined"
                      color="cyan"
                      size="small"
                      v-for="agentAndRolesItem in getRoles(item.agentRoles, agent._id)"
                      :key="agentAndRolesItem._id"
                    >
                      {{ agentAndRolesItem.name }}
                    </v-chip>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <!-- <v-chip
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
              </v-chip> -->
            </td>
            <td>
              <span class="text-caption">{{ dateFormat(item.createAt) }}</span>
            </td>
            <td>
              <div>
                <v-btn
                  icon="mdi-dots-vertical"
                  size="x-small"
                  variant="outlined"
                  :id="`menu-activator${item._id}`"
                >
                </v-btn>
                <v-menu :activator="`#menu-activator${item._id}`">
                  <v-list class="py-0" density="compact" slim>
                    <template v-for="menuItem in menuItems" :key="menuItem.type">
                      <v-divider v-if="menuItem.type === 'divider'" />
                      <v-list-item
                        v-else
                        @click="
                          user.openFormDialog({
                            model: menuItem.code,
                            id: item._id,
                            userItem: item,
                          })
                        "
                      >
                        <v-list-item-title>
                          <span class="text-subtitle-2">{{ menuItem.title }} </span>
                        </v-list-item-title>
                        <template v-slot:prepend>
                          <v-icon size="small" :icon="menuItem.icon"></v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-menu>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
