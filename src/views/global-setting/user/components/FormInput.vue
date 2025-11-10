<script setup>
import { inject } from 'vue'

const user = inject('user')
</script>

<template>
  <v-row dense>
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

      <v-col cols="12">
        <v-select
          v-model="user.form.value.agentRoles[0]['agent']"
          label="商家"
          variant="outlined"
          :items="user.agentList.value"
          item-title="name"
          item-value="_id"
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
