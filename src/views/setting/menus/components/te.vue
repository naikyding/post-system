<template>
  <tr>
    <td>
      <!-- toggle 子層按鈕 -->
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
          @click="menu.openConfirmDialog('deleteOperation', operationItem._id)"
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
            :icon="!openChildrenId[childrenItem._id] ? 'mdi-chevron-right' : 'mdi-chevron-down'"
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
          <v-btn
            @click="
              menu.openFormDialog({
                model: 'createMenu',
                parentId: childrenItem._id,
              })
            "
            icon="mdi-sticker-plus"
            size="40"
            variant="plain"
            color="success"
          ></v-btn>
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
          <v-btn
            @click="
              menu.openFormDialog({
                model: 'updateMenu',
                menuItem: childrenItem,
              })
            "
            icon="mdi-pencil"
            size="40"
            variant="plain"
            color="warning"
          ></v-btn>
          <v-btn
            @click="confirmDialog.open('deleteMenu', childrenItem._id)"
            icon="mdi-delete"
            size="40"
            variant="plain"
            color="error"
          ></v-btn>
        </td>
      </tr>

      <!-- operation 層 -->
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
    </template>
  </template>
</template>
