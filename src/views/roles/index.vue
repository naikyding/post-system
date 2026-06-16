<script setup>
import { useUserStore } from '@/stores/users'
import { computed, ref } from 'vue'
import router from '@/router'

const userStore = useUserStore()
const user = computed(() => userStore.baseInfo)
const userActiveRoleId = computed(() => userStore.activeRoleId)

async function saveActiveRoleId(id) {
  userStore.activeRoleId = id
  await localStorage.setItem('activeRoleId', id)
  router.replace({ path: '/' })
}

const activeRoles = computed(() => {
  if (!userStore.baseInfo?._id) return null

  return user.value.agentRoles.find((item) => item.agent._id === userStore.activeAgentId)
})
</script>

<template>
  <div class="d-flex justify-center align-center pa-4" style="min-height: 100dvh">
    <div>
      <template v-if="user.agentRoles">
        <p class="text-subtitle-2 mb-2">選擇商家：</p>

        <v-row dense>
          <v-col v-for="item in user?.agentRoles" :key="item.agent._id" cols="12" sm="6" md="4">
            <v-btn
              block
              height="80"
              color="primary"
              :variant="userStore.activeAgentId === item.agent._id ? 'flat' : 'outlined'"
              @click="userStore.saveActiveAgentId(item.agent._id)"
            >
              {{ item.agent.name }}
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-if="userStore.activeAgentId">
        <p v-if="userStore.activeAgentId" class="text-subtitle-2 mb-2 mt-4">選擇角色：</p>

        <v-row v-if="userStore.activeAgentId" dense>
          <v-col v-for="role in activeRoles?.roles" :key="role._id" cols="6" sm="4" md="3">
            <v-btn
              block
              height="80"
              color="primary"
              :variant="userActiveRoleId === role._id ? 'flat' : 'outlined'"
              @click="saveActiveRoleId(role._id)"
            >
              {{ role.name }}
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-btn
        class="my-8"
        color="error"
        block
        variant="plain"
        text="重新登入"
        append-icon="mdi-logout"
        @click="userStore.logoutFunc('/login')"
      ></v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
