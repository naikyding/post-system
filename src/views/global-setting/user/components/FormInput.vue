<script setup>
import { inject } from 'vue'

const user = inject('user')
</script>

<template>
  <v-row dense>
    {{ user.active.value.model }}
    <template v-if="user.active.value.model === 'password'">
      <v-col cols="12">
        <v-text-field
          v-model="user.pwdForm.value.oldPassword"
          type="password"
          label="請輸入舊密碼"
          variant="outlined"
          required
          :rules="[user.formRules.required, user.formRules.password]"
        ></v-text-field>

        <v-text-field
          v-model="user.pwdForm.value.newPassword"
          type="password"
          label="請輸入新密碼"
          variant="outlined"
          required
          :rules="[user.formRules.required, user.formRules.password]"
        ></v-text-field>
      </v-col>
    </template>
    <template v-else>
      <v-col cols="12">
        <v-text-field
          v-model="user.form.value.email"
          label="email"
          variant="outlined"
          required
          :rules="[user.formRules.required, user.formRules.email]"
        ></v-text-field>
      </v-col>
      <v-col v-if="user.active.value.model === 'create'" cols="12">
        <v-text-field
          v-model="user.form.value.password"
          type="password"
          label="密碼"
          variant="outlined"
          required
          :rules="[user.formRules.required, user.formRules.password]"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="user.form.value.nickname"
          label="綽號"
          variant="outlined"
          required
          :rules="[user.formRules.required, user.formRules.nickname]"
        ></v-text-field>
      </v-col>

      <template v-if="user.active.value.model !== 'update'">
        <v-col cols="12">
          <v-select
            v-model="user.form.value.agentRoles[0]['agent']"
            label="商家"
            variant="outlined"
            :items="user.agentList.value"
            item-title="name"
            item-value="_id"
            hide-details
            density="compact"
          >
            <template v-slot:item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps" :subtitle="item.raw.description"></v-list-item>
            </template>
          </v-select>
        </v-col>

        <v-col cols="12">
          <v-select
            :disabled="!user.form.value.agentRoles[0]['agent']"
            v-model="user.form.value.agentRoles[0]['roles']"
            :rules="[user.formRules.roles]"
            density="compact"
            :items="
              user.filterRolesByAgent(user.form.value.agentRoles[0]['agent'], user.roleList.value)
            "
            item-title="name"
            item-value="_id"
            label="角色"
            multiple
            variant="outlined"
            persistent-hint
            clearable
          >
            <template v-slot:selection="{ item, index }">
              <v-chip variant="outlined" color="cyan" :text="item.title" size="small"> </v-chip>
            </template>
          </v-select>
        </v-col>
      </template>
      <v-col v-else cols="12" class="mb-4">
        <v-card variant="tonal" color="surface-variant">
          <template
            v-for="(agentRoleItem, index) in user.form.value.agentRoles"
            :key="agentRoleItem._id"
          >
            <v-container>
              <v-row>
                <v-col cols="10">
                  <v-select
                    v-model="user.form.value.agentRoles[index]['agent']"
                    :label="`商家${index + 1}`"
                    variant="outlined"
                    :items="user.agentList.value"
                    item-title="name"
                    item-value="_id"
                    density="compact"
                    @update:modelValue="user.agentChange(user.form.value.agentRoles, index)"
                  >
                    <template v-slot:item="{ props: itemProps, item }">
                      <v-list-item
                        :disabled="user.agentSelectDynamicDisableCheck(item.raw._id, index)"
                        v-bind="itemProps"
                        :subtitle="item.raw.description"
                      ></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    :disabled="!user.form.value.agentRoles[index]['agent']"
                    v-model="user.form.value.agentRoles[index]['roles']"
                    :rules="[user.formRules.roles]"
                    density="compact"
                    :items="
                      user.filterRolesByAgent(
                        user.form.value.agentRoles[index]['agent'],
                        user.roleList.value,
                      )
                    "
                    item-title="name"
                    item-value="_id"
                    :label="`商家${index + 1} - 角色`"
                    multiple
                    variant="outlined"
                    persistent-hint
                    clearable
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip variant="outlined" color="cyan" :text="item.title" size="small">
                      </v-chip>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="2" class="d-flex">
                  <v-btn
                    @click="user.deleteFormAgentRolesItem(agentRoleItem)"
                    class="flex-grow-1"
                    block
                    color="error"
                    height="100%"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </template>

          <v-col cols="12">
            <v-btn
              :disabled="user.form.value.agentRoles.length >= user.agentList.value.length"
              @click="user.addAgentRolesItem"
              color="success"
              block
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="user.form.value.phone"
          label="手機"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea v-model="user.form.value.note" label="備註" variant="outlined"></v-textarea>
      </v-col>
    </template>
  </v-row>
</template>
