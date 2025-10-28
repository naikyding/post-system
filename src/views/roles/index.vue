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
  if (Array.isArray(userStore.baseInfo)) return []
  return user.value.agentRoles.find((item) => item.agent._id === userStore.activeAgentId)
})
</script>

<template>
  <div class="d-flex justify-center align-center" :style="{ height: '100dvh' }">
    <div>
      <template v-if="user.agentRoles">
        <p class="text-subtitle-2 px-2 mb-2">選擇「商家」:</p>
        <v-hover v-for="item in user?.agentRoles" :key="item.agent._id">
          <template v-slot:default="{ isHovering, props }">
            <v-btn
              :variant="
                isHovering || userStore.activeAgentId === item.agent._id ? 'flat' : 'outlined'
              "
              v-bind="props"
              @click="userStore.saveActiveAgentId(item.agent._id)"
              class="mx-2"
              color="primary"
              height="100"
            >
              {{ item.agent.name }}
            </v-btn>
          </template>
        </v-hover>
      </template>
      <template v-if="userStore.activeAgentId">
        <p class="text-subtitle-2 px-2 mb-2 mt-4">選擇「角色」:</p>
        <v-hover v-for="role in activeRoles['roles']" :key="role._id">
          <template v-slot:default="{ isHovering, props }">
            <v-btn
              @click="saveActiveRoleId(role._id)"
              v-bind="props"
              :variant="isHovering || userActiveRoleId === role._id ? 'flat' : 'outlined'"
              class="mx-2"
              color="primary"
              height="100"
              width="100"
            >
              {{ role.name }}
            </v-btn>
          </template>
        </v-hover>
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
