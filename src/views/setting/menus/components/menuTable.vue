<script setup>
import { inject, provide } from 'vue'

import { useMenuTable } from './useMenuTableJS'
import MenuRow from './MenuRow.vue'

const props = defineProps({
  menus: {
    type: Array,
  },
})

const menu = inject('menu')

const { headers, formatMenus, search, openChildrenId, getColor } = useMenuTable(props)

function toggleOpenChildrenId(ary, id) {
  ary.value[id] = !ary.value[id]
}

defineExpose({ openChildrenId })
provide('openChildrenId', {
  value: openChildrenId,
  toggle: toggleOpenChildrenId,
})
provide('getColor', getColor)
</script>

<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="search"
        class="mb-4"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>

      <v-btn
        block
        color="success"
        @click="
          menu.openFormDialog({
            model: 'createMenu',
          })
        "
      >
        <v-icon size="30">mdi-plus</v-icon>
      </v-btn>

      <v-data-table
        :headers="headers"
        :items="formatMenus"
        :search="search"
        density="compact"
        fixed-header
        hide-default-footer
        hover
      >
        <template v-slot:item="{ item }">
          <MenuRow :item="item" :level="0" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped></style>
