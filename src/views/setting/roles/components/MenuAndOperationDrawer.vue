<script setup>
import { inject, ref } from 'vue'
import { useMenusStore } from '@/stores/menus'
import ListGroupLoop from './ListGroupLoop.vue'

const menusStore = useMenusStore()
const status = ref(false)
const role = inject('role')

defineExpose({
  status,
})
</script>

<template>
  <v-navigation-drawer
    v-model="status"
    location="right"
    width="390"
    :style="{ zIndex: '99999' }"
    temporary
  >
    <v-card>
      <v-card-title>
        <p>
          {{ role.active.value.item?.name }}
        </p>
        <span class="text-caption">權限管理</span>
      </v-card-title>

      <v-card-text>
        <v-list :key="role.active.value.id">
          <ListGroupLoop :items="menusStore.menus" />
        </v-list>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
    <v-divider></v-divider>

    <template v-slot:append>
      <div class="pa-4">
        <v-btn @click="role.updateMenusAndOperations" block color="success">保存</v-btn>
        <v-btn
          @click="role.closeMenuAndOperationDrawer"
          class="mt-3"
          variant="outlined"
          block
          color="error"
          >取消</v-btn
        >
      </div>
    </template>
  </v-navigation-drawer>
</template>
