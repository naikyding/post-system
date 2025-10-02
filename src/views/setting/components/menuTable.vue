<script setup>
import { inject, ref } from 'vue'

import { useMenuTable } from './useMenuTableJS'
import confirmDialog from './confirmDialog.vue'

const props = defineProps({
  menus: {
    type: Array,
  },
})

const operation = inject('operation')

const { headers, formatMenus, search, openChildrenId, getColor } = useMenuTable(props)

const confirmDialogRef = ref(null)
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

      <v-btn block color="success">
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
          <tr>
            <td>
              <v-btn
                :icon="!openChildrenId[item._id] ? 'mdi-chevron-right' : 'mdi-chevron-down'"
                color="medium-emphasis"
                density="comfortable"
                size="small"
                variant="outlined"
                :disabled="openChildrenId[item._id] === undefined && item.operations.length < 1"
                @click="openChildrenId[item._id] = !openChildrenId[item._id]"
              ></v-btn>
              {{ item.name }}
            </td>
            <td>{{ item.routeName }}</td>
            <td>{{ item.path }}</td>
            <td>{{ item.component }}</td>
            <td class="text-right">
              <v-btn icon="mdi-sticker-plus" size="40" variant="plain" color="success"></v-btn>
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
              <v-btn icon="mdi-pencil" size="40" variant="plain" color="warning"></v-btn>
              <v-btn icon="mdi-delete" size="40" variant="plain" color="error"></v-btn>
            </td>
          </tr>

          <!-- 父層 操作項 -->
          <template v-if="openChildrenId[item._id]">
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
                  @click="confirmDialogRef.openConfirmDialog('deleteOperation', operationItem._id)"
                  icon="mdi-delete"
                  size="40"
                  variant="plain"
                  color="error"
                ></v-btn>
              </td>
            </tr>
          </template>

          <!-- 子項目 -->
          <template v-if="openChildrenId[item._id]">
            <template v-for="childrenItem in item.children" :key="childrenItem._id">
              <tr>
                <td class="pl-12">
                  <v-btn
                    :icon="
                      !openChildrenId[childrenItem._id] ? 'mdi-chevron-right' : 'mdi-chevron-down'
                    "
                    color="medium-emphasis"
                    density="comfortable"
                    size="small"
                    variant="outlined"
                    :disabled="openChildrenId[childrenItem._id] === undefined"
                    @click="openChildrenId[childrenItem._id] = !openChildrenId[childrenItem._id]"
                  ></v-btn>
                  {{ childrenItem.name }}
                </td>
                <td>{{ childrenItem.routeName }}</td>
                <td>{{ childrenItem.path }}</td>
                <td>{{ childrenItem.component }}</td>
                <td class="text-right">
                  <v-btn icon="mdi-sticker-plus" size="40" variant="plain" color="success"></v-btn>
                  <v-btn
                    @click="
                      operation.openOperationForm({
                        menuId: childrenItem._id,
                        model: 'createOperation',
                      })
                    "
                    icon="mdi-toy-brick-plus"
                    size="40"
                    variant="plain"
                    color="success"
                  ></v-btn>
                  <v-btn icon="mdi-pencil" size="40" variant="plain" color="warning"></v-btn>
                  <v-btn icon="mdi-delete" size="40" variant="plain" color="error"></v-btn>
                </td>
              </tr>

              <!-- 操作層 -->
              <template v-if="openChildrenId[childrenItem._id]">
                <tr v-for="operationItem in childrenItem.operations" :key="operationItem._id">
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
                    <v-btn
                      @click="
                        confirmDialogRef.openConfirmDialog('updateOperation', operationItem._id)
                      "
                      icon="mdi-pencil"
                      size="40"
                      variant="plain"
                      color="warning"
                    ></v-btn>
                    <v-btn
                      @click="
                        confirmDialogRef.openConfirmDialog('deleteOperation', operationItem._id)
                      "
                      icon="mdi-delete"
                      size="40"
                      variant="plain"
                      color="error"
                    ></v-btn>
                  </td>
                </tr>
              </template>
            </template>
          </template>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <confirmDialog ref="confirmDialogRef" />
</template>

<style lang="scss" scoped></style>
