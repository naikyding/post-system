<script setup>
import { inject } from 'vue'

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

    <td class="text-right" :style="{ minWidth: '200px' }">
      <!-- 新增 menu btn -->
      <v-btn
        @click="
          menu.openFormDialog({
            model: 'createMenu',
            parentId: item._id,
          })
        "
        icon="mdi-sticker-plus"
        size="40"
        variant="plain"
        color="success"
      ></v-btn>

      <!-- 新增 operation btn -->
      <v-btn
        icon="mdi-toy-brick-plus"
        @click="
          operation.openOperationForm({
            menuId: item._id,
            model: 'createOperation',
          })
        "
        size="40"
        variant="plain"
        color="success"
      ></v-btn>

      <!-- 修改 menu -->
      <v-btn
        icon="mdi-pencil"
        size="40"
        variant="plain"
        color="warning"
        @click="
          menu.openFormDialog({
            model: 'updateMenu',
            menuItem: item,
          })
        "
      ></v-btn>
      <!-- 刪除 -->
      <v-btn
        icon="mdi-delete"
        size="40"
        variant="plain"
        color="error"
        @click="confirmDialog.open('deleteMenu', item._id)"
      ></v-btn>
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
      <td class="text-right">
        <!-- 修改 -->
        <v-btn
          @click="
            operation.openOperationForm({
              operationItem: operationItem,
              model: 'updateOperation',
            })
          "
          icon="mdi-pencil"
          size="40"
          variant="plain"
          color="warning"
        ></v-btn>

        <!-- 刪除 -->
        <v-btn
          @click="menu.openConfirmDialog('deleteOperation', operationItem._id)"
          icon="mdi-delete"
          size="40"
          variant="plain"
          color="error"
        ></v-btn>
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
