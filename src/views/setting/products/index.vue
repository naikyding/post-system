<script setup>
import { useProducts } from './useProducts'
const {
  preEditSave,
  saveEditProduct,
  proDeleteProductOrExtras,
  deleteProductOrExtras,
  addProduct,
  table,
  addExtrasTable,
  addProductItem,
  editDialog,
  preEditSaveDialog,
  preDeleteDialog,
  preSaveDialog,
  statusSnackbar,
  active,
  search,
  addProductCancel,
  editProductCancel,
  editItem,
  addProductForm,
  editProductForm,
  priEditCancel,
  preDeleteContent,
} = useProducts()
</script>

<template>
  <div class="">
    <v-sheet class="mx-4 mb-4">
      <v-slide-group v-model="active.index" mandatory>
        <v-slide-group-item
          v-for="(item, index) in active.items"
          :key="index"
          v-slot="{ isSelected, toggle }"
        >
          <v-btn
            size="x-large"
            class="my-2"
            :color="isSelected ? 'primary' : undefined"
            :variant="isSelected ? 'tonal' : 'text'"
            @click="toggle"
          >
            {{ item.tabName }}
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>

      <v-row class="mt-1">
        <v-col cols="12" sm="6" class="py-1">
          <!-- 搜尋 input -->
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" class="py-1">
          <v-btn @click="addProduct" block size="x-large" color="success">ADD</v-btn>
        </v-col>
      </v-row>
    </v-sheet>

    <v-expand-transition class="content-height">
      <v-data-table
        :headers="table.headers"
        :items="active.items[active.index]['list']"
        :mobile="false"
        :search="search"
        fixed-header
        items-per-page="-1"
      >
        <!-- 狀態 -->
        <template v-slot:item.status="{ item }">
          <v-switch
            :model-value="item.status === 'active'"
            color="success"
            hide-details
            readonly
          ></v-switch>
        </template>

        <!-- 操作 -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <!-- 修改 -->
            <v-btn
              class="mr-2"
              size="small"
              color="warning"
              icon="mdi-pencil"
              @click="editItem(item)"
            ></v-btn>
            <v-btn
              size="small"
              color="error"
              icon="mdi-delete"
              @click="proDeleteProductOrExtras(item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-expand-transition>

    <!-- 新增 dialog -->
    <v-dialog v-model="addProductItem.status" max-width="600" scrollable>
      <v-form ref="addProductForm" @submit.prevent>
        <v-card :title="`新增${active.index === 1 ? '配料' : '產品'}`">
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12">
                  <v-switch
                    v-model="addProductItem.form.status"
                    color="green"
                    :label="editDialog.content.status"
                    true-value="active"
                    false-value="inactive"
                    hide-details
                    inset
                  ></v-switch>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="addProductItem.form.type"
                    clearable
                    label="類別"
                    variant="outlined"
                    required
                    :rules="[addProductItem.rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="addProductItem.form.price"
                    type="number"
                    inputmode="numeric"
                    clearable
                    label="價錢"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="addProductItem.form.name"
                    clearable
                    label="名稱"
                    variant="outlined"
                    :rules="[addProductItem.rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="addProductItem.form.description"
                    clearable
                    label="說明"
                    variant="outlined"
                    :rules="[addProductItem.rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" v-show="active.index === 0">
                  配料
                  <v-divider></v-divider>
                  <v-data-table
                    :headers="addExtrasTable.headers"
                    :items="active.items[1]['list']"
                    v-model="addProductItem.form.extras"
                    :item-value="(item) => item._id"
                    :mobile="false"
                    :search="search"
                    fixed-header
                    items-per-page="-1"
                    show-select
                  >
                    <template #bottom></template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <div class="pa-2">
              <v-btn
                color="error"
                text="取消"
                variant="outlined"
                size="large"
                @click="addProductCancel"
              ></v-btn>

              <v-btn
                type="submit"
                color="success"
                text="保存"
                variant="flat"
                size="large"
                @click="addProductItem.preSubmit(addProductItem.form)"
              ></v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- 修改 DIALOG -->
    <v-dialog v-model="editDialog.status" max-width="600" scrollable>
      <v-form ref="editProductForm" @submit.prevent>
        <v-card :title="`修改${active.index === 1 ? '配料' : '產品'}`">
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12">
                  <v-switch
                    v-model="editDialog.content.status"
                    color="green"
                    :label="editDialog.content.status"
                    true-value="active"
                    false-value="inactive"
                    hide-details
                    inset
                  ></v-switch>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editDialog.content.type"
                    clearable
                    label="類別"
                    variant="outlined"
                    :rules="[addProductItem.rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editDialog.content.price"
                    clearable
                    label="價錢"
                    variant="outlined"
                    :rules="[addProductItem.rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="editDialog.content.name"
                    clearable
                    label="名稱"
                    variant="outlined"
                    :rules="[addProductItem.rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="editDialog.content.description"
                    clearable
                    label="說明"
                    variant="outlined"
                    :rules="[addProductItem.rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" v-if="active.index === 0">
                  配料
                  <v-divider></v-divider>
                  <v-data-table
                    :headers="addExtrasTable.headers"
                    :items="active.items[1]['list']"
                    :item-value="(item) => item._id"
                    v-model="editDialog.content.extras"
                    :mobile="false"
                    :search="search"
                    fixed-header
                    items-per-page="-1"
                    show-select
                  >
                    <template #bottom></template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <div class="pa-2">
              <v-btn
                color="error"
                text="取消"
                variant="outlined"
                size="large"
                @click="editProductCancel"
              ></v-btn>

              <v-btn
                type="submit"
                color="success"
                text="保存"
                variant="flat"
                size="large"
                @click="preEditSave"
              ></v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- 修改 確認 dialog -->
    <v-dialog v-model="preEditSaveDialog" width="auto">
      <v-card width="400" title="保存確認" text="是否保存所有設置?">
        <template v-slot:actions>
          <v-btn variant="outlined" text="取消" size="large" color="error" @click="priEditCancel" />
          <v-btn
            class="ma-2"
            size="large"
            variant="flat"
            text="保存"
            color="success"
            @click="saveEditProduct(editDialog.content)"
          />
        </template>
      </v-card>
    </v-dialog>

    <!-- 確認 dialog -->
    <v-dialog v-model="preSaveDialog" width="auto">
      <v-card width="400" title="保存確認" text="是否保存所有設置?">
        <template v-slot:actions>
          <v-btn
            variant="outlined"
            text="取消"
            size="large"
            color="error"
            @click="preSaveDialog = false"
          />
          <v-btn
            class="ma-2"
            size="large"
            variant="flat"
            text="保存"
            color="success"
            @click="addProductItem.submit(addProductItem.form)"
          />
        </template>
      </v-card>
    </v-dialog>

    <!-- 刪除_確認 dialog -->
    <v-dialog v-model="preDeleteDialog" width="auto">
      <v-card width="400" title="刪除確認" :text="`是否刪除 「${preDeleteContent.name}」 項目? `">
        <template v-slot:actions>
          <v-btn
            variant="outlined"
            text="取消"
            size="large"
            color="error"
            @click="preDeleteDialog = false"
          />
          <v-btn
            class="ma-2"
            size="large"
            variant="flat"
            text="確認"
            color="success"
            @click="deleteProductOrExtras(preDeleteContent._id)"
          />
        </template>
      </v-card>
    </v-dialog>

    <!-- 狀態 -->
    <v-snackbar v-model="statusSnackbar.status" :color="statusSnackbar.color" :timeout="2000">
      {{ statusSnackbar.text }}
    </v-snackbar>
  </div>
</template>

<style lang="scss" scoped>
.content-height {
  height: calc(100dvh - 136px);
}
</style>
