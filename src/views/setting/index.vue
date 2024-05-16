<script setup>
import { ref, watch, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useExtrasStore } from '@/stores/extras'
import { useUserStore } from '@/stores/users'

const extrasStore = useExtrasStore()
const productsStore = useProductsStore()
const userStore = useUserStore()
const search = ref('')
const addProductForm = ref(null)
const editProductForm = ref(null)

const preEditSaveDialog = ref(false)
async function preEditSave() {
  const validation = await validationForm(editProductForm)
  if (validation) preEditSaveDialog.value = true
}
function priEditCancel() {
  preEditSaveDialog.value = false
}

function editProductCancel() {
  editDialog.value.content = {}
  editDialog.value.status = false
  editProductForm.value.reset()
}

async function saveEditProduct(form) {
  form.agent = userStore.agents
  const { status, message } = (await productsStore.updateProduct(form._id, form)) || {
    status: false,
    message: '發生錯誤',
  }
  if (!status) return priEditCancel()

  priEditCancel()
  editProductCancel()

  statusSnackbar.value.color = 'success'
  statusSnackbar.value.text = message
  statusSnackbar.value.status = true
}

const preSaveDialog = ref(false)

const preDeleteDialog = ref(false)
const preDeleteContent = ref({})
function proDeleteProduct(data) {
  preDeleteDialog.value = true
  preDeleteContent.value = data
}
async function deleteProduct(id) {
  const res = await productsStore.deleteProduct(id)
  preDeleteDialog.value = false

  if (res) {
    const { message } = res
    preDeleteContent.value = {}

    statusSnackbar.value.text = message
    statusSnackbar.value.status = true
  }
}

watch(
  () => preDeleteDialog.value,
  (status) => {
    if (!status) preDeleteContent.value = {}
  },
)

const statusSnackbar = ref({
  status: false,
  color: 'success',
  text: '--',
})

function addProduct() {
  getExtrasList()
  addProductItem.value.status = true
}

const addProductItem = ref({
  status: false,
  rules: {
    required(v) {
      return !!v || 'Field is required'
    },
  },
  form: {
    name: '',
    description: '',
    type: '',
    price: 0,
    extras: [],
  },
  preSubmit: preAddProductItemSubmit,
  submit: addProductItemSubmit,
})

async function validationForm(ref) {
  const { valid } = await ref.value.validate()
  return valid
}

async function preAddProductItemSubmit() {
  const valid = await validationForm(addProductForm)
  if (!valid) return false

  preSaveDialog.value = true
}

async function addProductItemSubmit(form) {
  form.agent = userStore.agents

  const res = await productsStore.createProduct(form)
  preSaveDialog.value = false

  if (res) {
    const { message } = res
    // reFetchData(active.value.index)
    addProductItem.value.status = false
    statusSnackbar.value.color = 'success'
    statusSnackbar.value.text = message

    addProductForm.value.reset()
    addProductItem.value.form.extras.length = 0

    statusSnackbar.value.status = true
  }
}

const editDialog = ref({
  status: false,
  content: {},
})

const active = ref({
  index: 0,
  items: [
    {
      tabName: '商品',
      list: computed(() => formatProductList(productsStore.products)),
      getList: getProductsList,
    },
    {
      tabName: '配料',
      list: computed(() => extrasStore.extras),
      getList: getExtrasList,
    },
  ],
})

function formatProductList(list) {
  return list.reduce((acc, cur) => {
    return (acc = [...acc, ...cur.items])
  }, [])
}

const table = ref({
  headers: [
    { title: '類型', key: 'type' },
    { title: '名稱', key: 'name' },
    { title: '說明', key: 'description' },
    { title: '價錢', key: 'price', align: 'end', value: (item) => `$${item.price}` },
    { title: 'Actions', key: 'actions', align: 'center' },
  ],
})

const addExtrasTable = ref({
  headers: [
    { title: '類型', key: 'type' },
    { title: '名稱', key: 'name' },
    { title: '說明', key: 'description' },
    { title: '價錢', key: 'price', align: 'end', value: (item) => `$${item.price}` },
  ],
})

watch(
  () => active.value.index,
  (status) => {
    reFetchData(status)
  },
)

function reFetchData(status) {
  search.value = ''
  active.value.items[status]['getList']()
}

function getExtrasList() {
  extrasStore.getExtrasList()
}

function getProductsList() {
  productsStore.getProducts()
}

function editItem(item) {
  getExtrasList()
  editDialog.value.status = true
  editDialog.value.content = {}
  const cloneItem = JSON.parse(JSON.stringify(item))
  cloneItem.extras = cloneItem.extras.reduce((acc, cur) => {
    return (acc = [...acc, ...cur.items.map((item) => item._id)])
  }, [])
  editDialog.value.content = cloneItem
}

getProductsList()
</script>

<template>
  <div class="">
    <v-sheet class="mx-4 mb-4">
      <v-slide-group v-model="active.index">
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
              @click="proDeleteProduct(item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-expand-transition>

    <!-- 新增 dialog -->
    <v-dialog v-model="addProductItem.status" max-width="600" scrollable>
      <v-form ref="addProductForm" @submit.prevent>
        <v-card title="新增">
          <v-card-text>
            <v-container>
              <v-row dense>
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

                <v-col cols="12">
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
                text="Close"
                variant="outlined"
                size="large"
                @click="dialog = false"
              ></v-btn>

              <v-btn
                type="submit"
                color="success"
                text="Save"
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
        <v-card title="修改">
          <v-card-text>
            <v-container>
              <v-row dense>
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

                <v-col cols="12">
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
                text="Close"
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
            @click="deleteProduct(preDeleteContent._id)"
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
