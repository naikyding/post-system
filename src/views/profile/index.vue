<script setup>
import { useUserStore } from '@/stores/users'
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue'
import { computed, ref } from 'vue'
const userStore = useUserStore()
const ConfirmDialogRef = ref(null)
const user = computed(() => userStore.baseInfo)
const userRoles = computed(() => userStore.activeAgentData?.roles || [])

const cardKey = ref(0)
const activeRoleId = ref(null)

function cancelDialog() {
  activeRoleId.value = null
  cardKey.value++
  ConfirmDialogRef.value.status = false
}
async function saveDialog() {
  await localStorage.setItem('activeRoleId', activeRoleId.value)
  userStore.activeRoleId = localStorage.getItem('activeRoleId')
  cardKey.value++
  ConfirmDialogRef.value.status = false
}

function showConfirmDialog(id) {
  if (userStore.activeRoleId === id) return false

  activeRoleId.value = id
  ConfirmDialogRef.value.status = true
}
</script>

<template>
  <div class="pa-5">
    <v-card title="我的檔案" subtitle="管理你的檔案以保護你的帳戶">
      <v-card-text>
        <v-divider></v-divider>

        <v-row class="py-4">
          <v-col cols="12" sm="6" md="4" class="d-flex flex-column align-center">
            <v-avatar size="100" color="surface-variant">
              <v-img :alt="userStore.nickname" :src="user.avatar"></v-img>
            </v-avatar>

            <h3 class="py-4">{{ user.nickname }}</h3>

            <v-container class="mt-4">
              <v-row>
                <v-col class="py-2 d-flex flex-column align-center" cols="12">
                  <p>角色切換</p>

                  <v-btn-toggle
                    border
                    mandatory
                    divided
                    :model-value="userStore.activeRoleId"
                    color="primary"
                    :key="cardKey"
                  >
                    <v-btn
                      v-for="role in userRoles"
                      :value="role._id"
                      @click="showConfirmDialog(role._id)"
                      :key="role._id"
                    >
                      {{ role.name }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-container>
          </v-col>

          <v-col cols="12" sm="6" md="8">
            <v-row>
              <v-col cols="12">
                <h3>Email</h3>
                <v-text-field
                  hide-details
                  disabled
                  variant="outlined"
                  :model-value="user.email"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <h3>手機</h3>
                <v-text-field
                  hide-details
                  disabled
                  variant="outlined"
                  :model-value="user.phone"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <h3>個人簡介</h3>
                <v-textarea
                  hide-details
                  rows="2"
                  variant="outlined"
                  :model-value="user.note"
                  density="compact"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-btn block variant="flat" color="success">OOOOOO</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <ConfirmDialog
      ref="ConfirmDialogRef"
      title="確認切換"
      text="確認您要切換目前角色?"
      @cancel-event="cancelDialog"
      @save-event="saveDialog"
    />
  </div>
</template>

<style lang="scss" scoped></style>
