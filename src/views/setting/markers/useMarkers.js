import { onMounted, provide, ref, watch } from 'vue'
import { useMarkersStore } from '@/stores/products'
import catchAsync from '@/utils/catchAsync'
import { createMarkerAPI, deleteMarkerAPI, editMarkerAPI } from '@/api'

export function useMarkers({ tableRef, formDialogRef, confirmDialogRef }) {
  const markersStore = useMarkersStore()

  const initForm = ({ name = '', description = '', sort = 0 } = {}) => {
    return {
      name,
      description,
      sort,
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

    const { status } = await createMarkerAPI(form.value)
    successFunc(status)
  })

  const update = catchAsync(async () => {
    const isValid = await validateForm()
    if (!isValid) return

    const id = active.value.id
    const payload = form.value
    const { status } = await editMarkerAPI({ id, data: payload })
    successFunc(status)
  })

  function successFunc(status) {
    if (status) {
      cancelFormDialog()
      markersStore.getMarkers()
    }
  }

  const deleteItem = catchAsync(async () => {
    const id = active.value.id
    const { status } = await deleteMarkerAPI(id)
    if (status) {
      cancelConfirmDialog()
      markersStore.getMarkers()
    }
  })

  onMounted(() => {
    markersStore.getMarkers()
  })

  provide('markers', {
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
