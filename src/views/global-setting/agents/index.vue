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
      <h3 class="pa-4 pb-0">商家設定</h3>

      <Table class="d-flex flex-column flex-grow-1" :headers="headers" :items="items" />
    </div>

    <FormDialog ref="formDialogRef" :title="formDialog.title">
      <v-form ref="formRef">
        <v-row class="px-2" dense>
          <v-col cols="12">
            <v-text-field
              v-model="form.name"
              label="名稱"
              variant="outlined"
              required
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.description"
              label="說明"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.image"
              label="圖片"
              variant="outlined"
              required
            ></v-text-field>
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
