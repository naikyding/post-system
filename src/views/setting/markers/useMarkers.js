import { onMounted, provide, ref, watch } from 'vue'
import { useMarkersStore } from '@/stores/products'
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
  })

  watch(
    () => formDialogRef.value?.status,
    (newValue, oldValue) => {
      if (oldValue && !newValue) {
        resetForm()
      }
    },
  )

  const form = ref(initForm())
  const active = ref(initActive())

  const openFormDialog = ({ model }) => {
    active.value.model = model
    formDialogRef.value.status = true
  }

  const resetForm = () => {
    form.value = initForm()
  }

  const cancelFormDialog = () => {
    active.value.model = null
    formDialogRef.value.status = false
    resetForm()
  }

  const openConfirmDialog = () => {}

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
  })

  return { form }
}
