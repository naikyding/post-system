import { ref, watch, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useExtrasStore } from '@/stores/extras'
import { useUserStore } from '@/stores/users'

export function useProducts() {
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
    if (editProductForm.value) editProductForm.value.reset()
  }

  async function saveEditProduct(form) {
    const defaultMsg = {
      status: false,
      message: '發生錯誤',
    }

    let res

    active.value.index === 0
      ? (res = await productsStore.updateProduct(form._id, form))
      : (res = await extrasStore.updateExtra(form._id, form))

    const { status, message } = res || defaultMsg
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
  function proDeleteProductOrExtras(data) {
    preDeleteDialog.value = true
    preDeleteContent.value = data
  }
  async function deleteProductOrExtras(id) {
    let res

    // 如果是配料 tab
    active.value.index === 1
      ? (res = await extrasStore.deleteExtra(id))
      : (res = await productsStore.deleteProduct(id))

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
      status: 'active',
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

  watch(
    () => addProductItem.value.status,
    (status) => {
      if (!status) {
        addProductCancel()
        addProductItem.value.form.extras.length = 0
        addProductItem.value.form.status = 'active'
      }
    },
  )

  async function preAddProductItemSubmit() {
    const valid = await validationForm(addProductForm)
    if (!valid) return false

    preSaveDialog.value = true
  }
  function addProductCancel() {
    addProductItem.value.status = false
    if (addProductForm.value) addProductForm.value.reset()
  }
  async function addProductItemSubmit(form) {
    let res

    active.value.index === 1
      ? (res = await extrasStore.createExtrasItem(form))
      : (res = await productsStore.createProduct(form))

    preSaveDialog.value = false

    if (res) {
      const { message } = res
      statusSnackbar.value.color = 'success'
      statusSnackbar.value.text = message

      addProductCancel()

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
      { title: '狀態', key: 'status' },
      { title: '類型', key: 'type' },
      { title: '名稱', key: 'name' },
      { title: '說明', key: 'description' },
      { title: '價錢', key: 'price', align: 'end', value: (item) => `$${item.price}` },
      { title: '操作', key: 'actions', align: 'center' },
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

    if (active.value.index === 0) {
      cloneItem.extras = cloneItem.extras.reduce((acc, cur) => {
        return (acc = [...acc, ...cur.items.map((item) => item._id)])
      }, [])
    }

    editDialog.value.content = cloneItem
  }

  getProductsList()

  return {
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
  }
}
