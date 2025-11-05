<script setup>
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue'
import FormDialog from '@/components/dialog/FormDialog.vue'
import { useProfile } from './useProfile'
import { ref } from 'vue'

const passwordFormRef = ref(null)
const {
  user,
  userRoles,
  cancelDialog,
  saveDialog,
  showConfirmDialog,
  userStore,
  form,
  cardKey,
  formRules,
  formDialogStatus,
  openResetPasswordDialog,
  cancelResetPassword,
  resetPasswordSubmit,
  resetResetPassword,
} = useProfile({ passwordFormRef })
</script>

<template>
  <div class="d-flex flex-column">
    <div class="overflow-y-auto flex-grow-1 d-flex flex-column">
      <v-card
        class="flex-grow-1 overflow-y-auto"
        title="我的檔案"
        subtitle="管理你的檔案以保護你的帳戶"
      >
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
                      class="mt-2"
                      density="compact"
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

              <div class="pa-6 w-100">
                <v-btn @click="openResetPasswordDialog" block color="error"> 修改密碼 </v-btn>
              </div>
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

      <FormDialog
        v-model="formDialogStatus"
        title="修改密碼"
        icon="mdi-lock-reset"
        @submit-event="resetPasswordSubmit"
        @reset-event="resetResetPassword"
        @cancel-event="cancelResetPassword"
      >
        <v-form ref="passwordFormRef">
          <v-col cols="12">
            <v-text-field
              v-model="form.oldPassword"
              type="password"
              label="請輸入原密碼"
              variant="outlined"
              required
              :rules="[formRules.required]"
            ></v-text-field>

            <v-text-field
              class="mt-4"
              v-model="form.newPassword"
              type="password"
              label="請輸入新密碼"
              variant="outlined"
              required
              :rules="[formRules.required, formRules.format]"
            ></v-text-field>
          </v-col>
        </v-form>
      </FormDialog>

      <ConfirmDialog
        ref="ConfirmDialogRef"
        title="確認切換"
        text="確認您要切換目前角色?"
        @cancel-event="cancelDialog"
        @save-event="saveDialog"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
