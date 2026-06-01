import { ref, watch, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useExtrasStore } from '@/stores/extras'
import { useProductsCategoryStore } from '../../../stores/productCategories'
import { formatNumber } from 'chart.js/helpers'

export function useProducts() {
  const extrasStore = useExtrasStore()
  const productsStore = useProductsStore()
  const productCategoriesStore = useProductsCategoryStore()

  const search = ref('')
  const addProductForm = ref(null)
  const editProductForm = ref(null)

  const preEditSaveDialog = ref(false)
  async function preEditSave() {
    productCategoriesStore.getProductCategories()
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

    const formatPayload = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => value !== ''),
    )

    const actionMap = {
      0: () => productsStore.updateProduct(form._id, formatPayload),
      1: () => productCategoriesStore.updateProductCategory(form._id, formatPayload),
    }

    const res = await actionMap[active.value.index]?.()

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
    const actionMap = {
      0: () => productsStore.deleteProduct(id),
      1: () => productCategoriesStore.deleteProductCategory(id),
    }

    const res = await actionMap[active.value.index]?.()

    preDeleteDialog.value = false
    console.log(res)
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

  async function addProduct() {
    if (active.value.index === 0) {
      await getExtrasList({ status: 'active' })
    }

    productCategoriesStore.getProductCategories()
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
      price: 0,
      extras: [],
    },
    preSubmit: preAddProductItemSubmit,
    submit: addProductItemSubmit,
  })

  const defaultCategoryForm = {
    status: 'draft',
    name: '',
    slug: '',
    sort: 0,
    image: '',
    includeInDashboard: true,
  }

  const category = ref({
    rules: {
      required(v) {
        return !!v || 'Field is required'
      },
    },
    form: structuredClone(defaultCategoryForm),
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

    if (addProductForm.value) {
      addProductForm.value.reset()
      category.value.form = structuredClone(defaultCategoryForm)
    }
  }
  async function addProductItemSubmit(form) {
    const actionMap = {
      0: () => productsStore.createProduct(form),
      1: () => productCategoriesStore.createProductCategory(category.value.form),
    }

    const res = await actionMap[active.value.index]?.()

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
        tabName: '類別',
        list: computed(() => productCategoriesStore.list),
        getList: () => productCategoriesStore.getProductCategories(),
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

  const dynamicTableHeader = {
    0: [
      { title: '狀態', key: 'status' },
      { title: '類型', key: 'type' },
      { title: '類別', key: 'category.name' },
      { title: '名稱', key: 'name' },
      { title: '說明', key: 'description' },
      { title: '價錢', key: 'price', align: 'end', value: (item) => `$${item.price}` },
      { title: '操作', key: 'actions', align: 'center' },
    ],

    1: [
      { title: '狀態', key: 'status' },
      { title: '名稱', key: 'name' },
      { title: '代號', key: 'slug' },
      { title: '操作', key: 'actions', align: 'center' },
    ],
  }

  const tableHeaders = (index) => dynamicTableHeader[index]

  const addExtrasTable = ref({
    headers: [
      { title: '類別', key: 'category.name' },
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

  const extrasList = computed(() => extrasStore.extras)

  function getExtrasList(query) {
    extrasStore.getExtrasList(query)
  }

  function getProductsList() {
    productsStore.getProducts()
  }

  function editItem(item) {
    if (active.value.index === 0) {
      productCategoriesStore.getProductCategories()
      getExtrasList({ status: 'active' })
    }

    editDialog.value.content = {}

    const cloneItem = JSON.parse(JSON.stringify(item))

    if (active.value.index === 0) {
      cloneItem.extras = cloneItem.extras.reduce((acc, cur) => {
        return (acc = [...acc, ...cur.items.map((item) => item._id)])
      }, [])
      cloneItem.category = cloneItem.category?._id
    }
    editDialog.value.content = cloneItem

    editDialog.value.status = true
  }

  getProductsList()

  return {
    productCategoriesStore,
    category,
    tableHeaders,
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
    extrasList,
  }
}
