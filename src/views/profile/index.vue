<script setup>
import { useUserStore } from '@/stores/users'
import { computed } from 'vue'
const userStore = useUserStore()
const user = computed(() => userStore.baseInfo)
const userRoles = computed(() => user.value.agentRoles[0]['roles'] || [])
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

                  <v-btn-toggle color="primary" border mandatory>
                    <v-btn v-for="role in userRoles" :value="role.name" :key="role._id">
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
  </div>
</template>

<style lang="scss" scoped></style>
