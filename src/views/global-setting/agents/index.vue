<script setup>
import Table from './components/Table.vue'
import FormDialog from './components/FormDialog.vue'
import ConfirmDialog from '../../../components/dialog/ConfirmDialog.vue'

import { useAgents } from './useAgents'
import { ref } from 'vue'

const formDialogRef = ref(null)
const ConfirmDialogRef = ref(null)
const formRef = ref(null)

const { headers, items, formDialog, form, cancelConfirmDialog, saveConfirmDialog, rules } =
  useAgents({
    formDialogRef,
    ConfirmDialogRef,
    formRef,
  })
</script>

<template>
  <div class="bg-grey-darken-4 d-flex flex-column">
    <div class="flex-grow-1 overflow-auto">
      <h3 class="pa-4 pb-0">Global 商家設定</h3>

      <Table class="d-flex flex-column flex-grow-1" :headers="headers" :items="items" />
    </div>

    <FormDialog ref="formDialogRef" :title="formDialog.title">
      <v-form ref="formRef">
        <v-row class="px-2" dense>
          <v-col cols="12">
            <v-text-field
              v-model="form.name"
              label="店家名稱"
              variant="outlined"
              :rules="[rules.required]"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="form.code"
              label="店家代碼"
              hint="例如：MONSTER、FIDI"
              persistent-hint
              variant="outlined"
              :rules="[rules.required]"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="店家說明"
              variant="outlined"
              rows="3"
              auto-grow
            />
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="form.image" label="圖片網址" variant="outlined" />
          </v-col>

          <v-col cols="12">
            <v-select
              v-model="form.status"
              label="狀態"
              variant="outlined"
              :items="[
                {
                  title: '啟用',
                  value: 'active',
                },
                {
                  title: '停用',
                  value: 'inactive',
                },
              ]"
              item-title="title"
              item-value="value"
            />
          </v-col>
        </v-row>
      </v-form>
    </FormDialog>
    <ConfirmDialog
      ref="ConfirmDialogRef"
      title="刪除確認!"
      text="刪除後，將無法回復!"
      @cancel-event="cancelConfirmDialog"
      @save-event="saveConfirmDialog"
    />
  </div>
</template>
