import { ref, watch, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useExtrasStore } from '@/stores/extras'
import { useExtrasCategoryStore } from '../../../stores/extraCategories'
import { formatNumber } from 'chart.js/helpers'

export function useExtras() {
  const extrasStore = useExtrasStore()
  const productsStore = useProductsStore()
  const extrasCategoryStore = useExtrasCategoryStore()

  const search = ref('')
  const addExtraForm = ref(null)
  const editExtraForm = ref(null)

  const preEditSaveDialog = ref(false)
  async function preEditSave() {
    extrasCategoryStore.getExtraCategories()
    const validation = await validationForm(editExtraForm)
    if (validation) preEditSaveDialog.value = true
  }
  function priEditCancel() {
    preEditSaveDialog.value = false
  }

  function editExtraCancel() {
    editDialog.value.content = {}
    editDialog.value.status = false
    if (editExtraForm.value) editExtraForm.value.reset()
  }

  async function saveEditExtra(form) {
    const defaultMsg = {
      status: false,
      message: '發生錯誤',
    }

    const formatPayload = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => value !== ''),
    )

    const actionMap = {
      0: () => extrasStore.updateExtra(form._id, formatPayload),
      1: () => extrasCategoryStore.updateExtraCategory(form._id, formatPayload),
    }

    const res = await actionMap[active.value.index]?.()

    const { status, message } = res || defaultMsg
    if (!status) return priEditCancel()

    priEditCancel()
    editExtraCancel()

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
  async function deleteExtraOrExtraCategory(id) {
    const actionMap = {
      0: () => extrasStore.deleteExtra(id),
      1: () => extrasCategoryStore.deleteExtraCategory(id),
    }

    const res = await actionMap[active.value.index]?.()

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

  function addExtra() {
    if (active.value.index === 0) extrasCategoryStore.getExtraCategories()
    addExtraItem.value.status = true
  }

  const addExtraItem = ref({
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
    submit: addExtraItemSubmit,
  })

  const category = ref({
    rules: {
      required(v) {
        return !!v || 'Field is required'
      },
    },
    form: {
      status: 'draft',
      name: '',
      slug: '',
      sort: 0,
      image: '',
    },
  })

  async function validationForm(ref) {
    const { valid } = await ref.value.validate()
    return valid
  }

  watch(
    () => addExtraItem.value.status,
    (status) => {
      if (!status) {
        addExtraCancel()
        addExtraItem.value.form.extras.length = 0
        addExtraItem.value.form.status = 'active'

        category.value.form.status = 'draft'
        category.value.form.sort = 0
      }
    },
  )

  async function preAddProductItemSubmit() {
    const valid = await validationForm(addExtraForm)
    if (!valid) return false

    preSaveDialog.value = true
  }
  function addExtraCancel() {
    addExtraItem.value.status = false
    if (addExtraForm.value) addExtraForm.value.reset()
  }
  async function addExtraItemSubmit(form) {
    const actionMap = {
      0: () => extrasStore.createExtrasItem(form),
      1: () => extrasCategoryStore.createExtraCategory(category.value.form),
    }

    const res = await actionMap[active.value.index]?.()

    preSaveDialog.value = false

    if (res) {
      const { message } = res
      statusSnackbar.value.color = 'success'
      statusSnackbar.value.text = message

      addExtraCancel()

      addExtraItem.value.form.extras.length = 0

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
        tabName: '配料',
        list: computed(() => extrasStore.extras),
        getList: getExtrasList,
      },
      {
        tabName: '類別',
        list: computed(() => extrasCategoryStore.list),
        getList: extrasCategoryStore.getExtraCategories,
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

  function getExtrasList(query) {
    extrasStore.getExtrasList(query)
  }

  function getProductsList() {
    productsStore.getProducts()
  }

  function editItem(item) {
    if (active.value.index === 0) {
      extrasCategoryStore.getExtraCategories()
      getExtrasList({ status: 'active' })
    }

    editDialog.value.content = {}

    const cloneItem = JSON.parse(JSON.stringify(item))
    cloneItem.category = cloneItem.category?._id

    console.log(cloneItem)
    editDialog.value.content = cloneItem

    editDialog.value.status = true
  }

  getExtrasList()

  return {
    extrasCategoryStore,
    category,
    tableHeaders,
    preEditSave,
    saveEditExtra,
    proDeleteProductOrExtras,
    deleteExtraOrExtraCategory,
    addExtra,
    table,
    addExtrasTable,
    addExtraItem,
    editDialog,
    preEditSaveDialog,
    preDeleteDialog,
    preSaveDialog,
    statusSnackbar,
    active,
    search,
    addExtraCancel,
    editExtraCancel,
    editItem,
    addExtraForm,
    editExtraForm,
    priEditCancel,
    preDeleteContent,
  }
}
