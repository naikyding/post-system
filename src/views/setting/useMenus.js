import { useMenusStore } from '@/stores/menus'
import { onMounted, provide, ref } from 'vue'
import { createOperationAPI, updateOperationAPI } from '@/api'
import catchAsync from '../../utils/catchAsync'

const menuStore = useMenusStore()

export function useMenus(operationFormDialogRef) {
  const initOperationForm = (item = {}) => {
    const { name = '', description = '', menuId = '', operate = '', action = '' } = item

    return { name, description, menuId, operate, action }
  }

  const resetOperation = () => {
    operationForm.value = initOperationForm()
    activeModel.value = null
    activeId.value = null
    operationFormDialogRef.value.status = false
  }

  const operationForm = ref(initOperationForm())

  const activeId = ref(null)
  const activeModel = ref(null)

  provide('activeId', {
    id: activeId,
    saveActiveIdByType,
  })

  const createOperation = catchAsync(async () => {
    const validateForm = await operationFormDialogRef.value.validateOperationForm()
    if (validateForm) {
      const { status } = await createOperationAPI(operationForm.value)
      if (status) {
        resetOperation()
        menuStore.getMenusAndOperations()
      }
    }
  })

  const updateOperation = catchAsync(async () => {
    console.log('updateOperation')
    const validateForm = await operationFormDialogRef.value.validateOperationForm()
    if (validateForm) {
      const { status } = await updateOperationAPI(activeId.value, operationForm.value)
      if (status) {
        resetOperation()
        menuStore.getMenusAndOperations()
      }
    }
  })

  provide('operation', {
    model: activeModel,
    form: operationForm,
    openOperationForm,
    createOperation,
    updateOperation,
    resetOperationForm,
    cancelOperation: resetOperation,
  })

  function openOperationForm({ menuId, model, operationItem }) {
    activeModel.value = model

    if (operationItem) {
      activeId.value = operationItem._id
      operationForm.value = initOperationForm(operationItem)
    }

    if (menuId) {
      operationForm.value.menuId = menuId
      activeId.value = menuId
    }
    operationFormDialogRef.value.status = true
  }

  function resetOperationForm() {
    const menuId = activeId.value
    operationFormDialogRef.value.resetOperationForm()
    operationForm.value.menuId = menuId
  }

  function saveActiveIdByType(type, menuId) {
    if (type === 'operation') operationForm.value.menuId = menuId
  }

  onMounted(() => {
    menuStore.getMenusAndOperations()
  })

  return {
    operationForm,
    activeId,
    activeModel,
    menuStore,
    saveActiveIdByType,
    resetOperationForm,
  }
}
