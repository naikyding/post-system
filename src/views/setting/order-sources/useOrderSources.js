import { onMounted, provide, ref, watch } from 'vue'
import { useOrderSourcesStore } from '@/stores/orderSources'
import catchAsync from '@/utils/catchAsync'
import { createOrderSourceAPI, deleteOrderSourceAPI, editOrderSourceAPI } from '@/api'

export function useOrderSources({ tableRef, formDialogRef, confirmDialogRef }) {
  const orderSourcesStore = useOrderSourcesStore()

  const initForm = ({
    name = '',
    description = '',
    sort = 0,
    status = 'active',
    isDefault = false,
  } = {}) => {
    return {
      name,
      description,
      sort,
      status,
      isDefault,
    }
  }

  const initActive = () => ({
    model: '',
    id: '',
    data: {},
  })

  watch(
    () => formDialogRef.value?.status,
    (newValue, oldValue) => {
      if (oldValue && !newValue) {
        cancelFormDialog()
      }
    },
  )

  watch(
    () => confirmDialogRef.value?.status,
    (newStatus, oldStatus) => {
      if (!newStatus && oldStatus) {
        cancelConfirmDialog()
      }
    },
  )

  const form = ref(initForm())
  const formRules = {
    name: (v) => !!v || '名稱必填',
    sort: (v) => {
      if (v === null || v === undefined || v === '') return '排序必填'

      if (!Number.isInteger(Number(v))) return '排序必須為整數'

      if (Number(v) < 0) return '排序不可小於 0'

      return true
    },
  }

  const active = ref(initActive())

  const openFormDialog = ({ model, id, data }) => {
    active.value.model = model
    if (id) active.value.id = id
    if (data) {
      active.value.data = data
      form.value = initForm(data)
    }

    formDialogRef.value.status = true
  }

  const resetForm = () => {
    form.value = initForm(active.value.data)
    formDialogRef.value.form?.resetValidation()
  }

  const cancelFormDialog = () => {
    active.value.data = {}
    formDialogRef.value.status = false
    resetForm()
  }

  const openConfirmDialog = ({ model, id, data }) => {
    active.value.model = model
    active.value.id = id
    active.value.data = data
    confirmDialogRef.value.status = true
  }

  const cancelConfirmDialog = () => {
    confirmDialogRef.value.status = false
    active.value = initActive()
  }

  const validateForm = async () => {
    const { valid } = await formDialogRef.value.form.validate()
    if (!valid) return false

    return true
  }

  const create = catchAsync(async () => {
    const isValid = await validateForm()
    if (!isValid) return

    const { status } = await createOrderSourceAPI(form.value)
    successFunc(status)
  })

  const update = catchAsync(async () => {
    const isValid = await validateForm()
    if (!isValid) return

    const id = active.value.id
    const payload = form.value
    const { status } = await editOrderSourceAPI({ id, data: payload })
    successFunc(status)
  })

  function successFunc(status) {
    if (status) {
      cancelFormDialog()
      orderSourcesStore.getOrderSources()
    }
  }

  const deleteItem = catchAsync(async () => {
    const id = active.value.id
    const { status } = await deleteOrderSourceAPI(id)
    if (status) {
      cancelConfirmDialog()
      orderSourcesStore.getOrderSources()
    }
  })

  onMounted(() => {
    orderSourcesStore.getOrderSources()
  })

  provide('orderSources', {
    active,
    form,

    openFormDialog,
    resetForm,
    cancelFormDialog,
    openConfirmDialog,
    cancelConfirmDialog,

    create,
    update,
    deleteItem,
    formRules,
  })

  return { form }
}
