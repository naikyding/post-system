<script setup>
import { inject } from 'vue'
import DotsActionMenu from '@/components/DotsActionMenu.vue'

defineProps({
  item: {
    type: Object,
  },
  level: { type: Number, default: 0 },
})

const menu = inject('menu')
const openChildrenId = inject('openChildrenId')
const getColor = inject('getColor')
const operation = inject('operation')
const confirmDialog = inject('confirmDialog')

const menuItems = [
  {
    title: '新增子選單',
    icon: 'mdi-sticker-plus',
    code: 'createMenu',
    event: ({ model, itemData }) => menu.openFormDialog({ model, parentId: itemData._id }),
  },
  { type: 'divider' },
  {
    title: '新增操作權',
    icon: 'mdi-toy-brick-plus',
    code: 'createOperation',
    event: ({ model, itemData }) => operation.openOperationForm({ model, menuId: itemData._id }),
  },
  { type: 'divider' },
  {
    title: '修改選單',
    icon: 'mdi-pencil',
    code: 'updateMenu',
    event: ({ model, itemData }) => menu.openFormDialog({ model, menuItem: itemData }),
  },
  { type: 'divider' },
  {
    title: '刪除選單',
    icon: 'mdi-delete',
    code: 'deleteMenu',
    event: ({ model, itemData }) => confirmDialog.open(model, itemData._id),
  },
]

const menuItems2 = [
  {
    title: '修改權限',
    icon: 'mdi-pencil',
    code: 'updateOperation',
    event: ({ model, itemData }) => operation.openOperationForm({ model, operationItem: itemData }),
  },
  { type: 'divider' },
  {
    title: '刪除權限',
    icon: 'mdi-delete',
    code: 'deleteOperation',
    event: ({ model, itemData }) => menu.openConfirmDialog(model, itemData._id),
  },
]
</script>

<template>
  <tr>
    <td :style="{ paddingLeft: `${(level + 1) * 16}px`, minWidth: '125px' }">
      <!-- toggle 子層按鈕 -->
      <v-btn
        :icon="!openChildrenId.value.value[item._id] ? 'mdi-chevron-right' : 'mdi-chevron-down'"
        color="medium-emphasis"
        density="comfortable"
        size="small"
        variant="outlined"
        :disabled="openChildrenId.value.value[item._id] === undefined && item.operations.length < 1"
        @click="openChildrenId.toggle(openChildrenId.value, item._id)"
      ></v-btn>
      {{ item.name }}
    </td>
    <td>{{ item.routeName }}</td>
    <td>{{ item.path }}</td>
    <td>{{ item.component }}</td>

    <td class="text-center py-1" :style="{ minWidth: '200px' }">
      <DotsActionMenu :items="menuItems" :id="item._id" :data="item" />
    </td>
  </tr>

  <!-- 父層 operation項 -->
  <template v-if="openChildrenId.value.value[item._id]">
    <tr v-for="operationItem in item.operations" :key="operationItem._id">
      <td class="pl-12">
        <span class="pl-8">
          <v-chip
            :color="getColor(operationItem.action)"
            :text="`操作:` + operationItem.name"
            size="x-small"
          ></v-chip>
        </span>
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td class="text-center py-1">
        <DotsActionMenu :items="menuItems2" :id="operationItem._id" :data="operationItem" />
      </td>
    </tr>
  </template>

  <template v-if="openChildrenId.value.value[item._id]">
    <MenuRow
      v-for="childrenItem in item.children"
      :key="`${childrenItem._id}_${level}`"
      :item="childrenItem"
      :level="level + 1"
    />
  </template>
</template>
