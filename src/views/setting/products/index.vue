<script setup>
import { useProducts } from './useProducts'
import DotsActionMenu from '@/components/DotsActionMenu.vue'

const {
  preEditSave,
  saveEditProduct,
  proDeleteProductOrExtras,
  deleteProductOrExtras,
  addProduct,
  tableHeaders,
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
  category,
  productCategoriesStore,
} = useProducts()

const menuItems = [
  {
    title: '修改商品',
    icon: 'mdi-pencil',
    code: 'update',
    event: ({ model, itemData }) => editItem(itemData),
  },
  { type: 'divider' },
  {
    title: '刪除商品',
    icon: 'mdi-delete',
    code: 'delete',
    event: ({ model, itemData }) => proDeleteProductOrExtras(itemData),
  },
]

const statusMap = {
  draft: {
    text: '草稿',
    color: 'grey',
    icon: 'mdi-file-document-outline',
  },

  available: {
    text: '啟用中',
    color: 'success',
    icon: 'mdi-check-circle',
  },

  hidden: {
    text: '隱藏',
    color: 'error',
    icon: 'mdi-eye-off',
  },
}
</script>

<template>
  <div class="d-flex flex-column" :style="{ height: 'calc(100dvh-48px)' }">
    <v-sheet class="px-4 pb-4">
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
        :headers="tableHeaders(active.index)"
        :items="active.items[active.index]['list']"
        :mobile="false"
        :search="search"
        fixed-header
        items-per-page="-1"
        hide-default-footer
      >
        <!-- 狀態 -->
        <template v-slot:item.status="{ item }">
          <template v-if="active.index === 2">
            <v-chip :color="statusMap[item.status]?.color" size="small" label>
              <v-icon start size="14">
                {{ statusMap[item.status]?.icon }}
              </v-icon>

              {{ statusMap[item.status]?.text }}
            </v-chip>
          </template>
          <template v-else>
            <v-switch
              :model-value="item.status === 'active'"
              color="success"
              hide-details
              readonly
            ></v-switch>
          </template>
        </template>

        <!-- 操作 -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-center">
            <DotsActionMenu :items="menuItems" :data="item" :id="item._id" />
          </div>
        </template>
      </v-data-table>
    </v-expand-transition>

    <!-- 新增 dialog -->
    <v-dialog v-model="addProductItem.status" max-width="600" scrollable>
      <v-form ref="addProductForm" @submit.prevent>
        <v-card :title="`新增${active['items'][active.index]['tabName']}`">
          <v-card-text>
            <v-container>
              <v-row dense>
                <template v-if="active['items'][active.index]['tabName'] === '類別'">
                  <v-col cols="12">
                    <v-select
                      v-model="category.form.status"
                      label="狀態"
                      variant="outlined"
                      :items="[
                        { title: '準備中', name: 'draft' },
                        { title: '啟用中', name: 'available' },
                        { title: '隱藏', name: 'hidden' },
                      ]"
                      item-title="title"
                      item-value="name"
                    ></v-select>
                  </v-col>

                  <!-- 排序 -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="category.form.sort"
                      clearable
                      label="排序"
                      variant="outlined"
                      :rules="[category.rules.required]"
                    ></v-text-field>
                  </v-col>

                  <!-- 名稱 -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="category.form.name"
                      clearable
                      label="名稱"
                      variant="outlined"
                      :rules="[category.rules.required]"
                    ></v-text-field>
                  </v-col>

                  <!-- 代碼 -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="category.form.slug"
                      clearable
                      label="代碼"
                      variant="outlined"
                      :rules="[category.rules.required]"
                    ></v-text-field>
                  </v-col>

                  <!-- 圖片 -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="category.form.image"
                      clearable
                      label="圖片"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </template>

                <template v-else>
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
                    <!-- NEW -->
                    <v-select
                      v-if="active.index === 0"
                      v-model="addProductItem.form.category"
                      label="類別"
                      variant="outlined"
                      :items="productCategoriesStore.list"
                      item-title="name"
                      item-value="_id"
                      :rules="[addProductItem.rules.required]"
                    ></v-select>
                    <!-- OLD -->
                    <v-text-field
                      v-else
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
                </template>
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
                <template v-if="active['items'][active.index]['tabName'] === '類別'">
                  <!-- 狀態 -->
                  <v-col cols="12">
                    <v-select
                      v-model="editDialog.content.status"
                      label="狀態"
                      variant="outlined"
                      :items="[
                        { title: '準備中', name: 'draft' },
                        { title: '啟用中', name: 'available' },
                        { title: '隱藏', name: 'hidden' },
                      ]"
                      item-title="title"
                      item-value="name"
                    ></v-select>
                  </v-col>

                  <!-- 排序 -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="editDialog.content.sort"
                      clearable
                      label="排序"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>

                  <!-- 名稱 -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="editDialog.content.name"
                      clearable
                      label="名稱"
                      variant="outlined"
                      :rules="[category.rules.required]"
                    ></v-text-field>
                  </v-col>

                  <!-- 代碼 -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="editDialog.content.slug"
                      clearable
                      label="代碼"
                      variant="outlined"
                      :rules="[category.rules.required]"
                    ></v-text-field>
                  </v-col>

                  <!-- 圖片 -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="editDialog.content.image"
                      clearable
                      label="圖片"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </template>

                <template v-else>
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
                    <!-- NEW -->
                    <v-select
                      v-if="active.index === 0"
                      v-model="editDialog.content.category"
                      label="類別"
                      variant="outlined"
                      :items="productCategoriesStore.list"
                      item-title="name"
                      item-value="_id"
                      :rules="[addProductItem.rules.required]"
                    ></v-select>

                    <v-text-field
                      v-model="editDialog.content.type"
                      clearable
                      label="類別"
                      variant="outlined"
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
                </template>
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
                class="ml-4"
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
  flex: 1; /* 撐滿剩餘空間 */
  overflow: auto; /* 可捲動 */
  min-height: 0; /* 避免 flex 捲軸失效 */
}
</style>
