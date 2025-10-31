import { onMounted, provide, ref, watch } from 'vue'
import { useMarkersStore } from '@/stores/products'
import catchAsync from '@/utils/catchAsync'
import { createMarkerAPI, deleteMarkerAPI, editMarkerAPI } from '@/api'

export function useMarkers({ tableRef, formDialogRef, confirmDialogRef }) {
  const markersStore = useMarkersStore()

  const initForm = ({ name = '', description = '' } = {}) => {
    return {
      name,
      description,
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

  const create = catchAsync(async () => {
    const { status } = await createMarkerAPI(form.value)
    successFunc(status)
  })

  const update = catchAsync(async () => {
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
  })

  return { form }
}
