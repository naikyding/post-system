import { useMenusStore } from '@/stores/menus'
import { onMounted, provide, ref } from 'vue'
import { createOperationAPI, updateOperationAPI, deleteOperationAPI } from '@/api'
import catchAsync from '../../utils/catchAsync'

const menuStore = useMenusStore()

export function useMenus({ formDialogRef, confirmDialogRef, menuTableRef }) {
  const initOperationForm = (item = {}) => {
    const { name = '', description = '', menuId = '', operate = '', action = '' } = item

    return { name, description, menuId, operate, action }
  }

  const initMenuForm = (item = {}) => {
    const {
      sort = 0,
      status = true,
      icon = '',
      name = '',
      description = '',
      routeName = '',
      path = '',
      component = '',
    } = item
    return {
      sort,
      status,
      icon,
      name,
      description,
      routeName,
      path,
      component,
    }
  }

  const operationForm = ref(initOperationForm())
  const menuForm = ref(initMenuForm())

  const activeId = ref(null)
  const activeModel = ref(null)

  provide('activeId', {
    id: activeId,
  })

  provide('activeModel', activeModel)

  const resetOperation = () => {
    operationForm.value = initOperationForm()
    activeModel.value = null
    activeId.value = null
    formDialogRef.value.status = false
  }

  const createOperation = catchAsync(async () => {
    const validateForm = await formDialogRef.value.validateOperationForm()
    if (validateForm) {
      const { status } = await createOperationAPI(operationForm.value)
      if (status) {
        resetOperation()
        menuStore.getMenusAndOperations()
      }
    }
  })

  const updateOperation = catchAsync(async () => {
    const validateForm = await formDialogRef.value.validateOperationForm()
    if (validateForm) {
      const { status } = await updateOperationAPI(activeId.value, operationForm.value)
      if (status) {
        resetOperation()
        menuStore.getMenusAndOperations()
      }
    }
  })

  const deleteOperation = catchAsync(async () => {
    const { status } = await deleteOperationAPI(activeId.value)
    if (status) {
      menuTableRef.value.openChildrenId = {}
      resetOperation()
      menuStore.getMenusAndOperations()
      confirmDialogRef.value.confirmDialogToggle()
    }
  })

  provide('operation', {
    model: activeModel,
    form: operationForm,
    openOperationForm,

    createOperation,
    updateOperation,
    deleteOperation,

    resetOperationForm,
    cancelOperation: resetOperation,
  })

  const createMenu = catchAsync(async () => {
    console.log('createMenu')
  })

  const updateMenu = catchAsync(async () => {
    console.log('updateMenu')
  })

  provide('menu', {
    openFormDialog,

    menuForm,
    createMenu,
    updateMenu,
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
    formDialogRef.value.status = true
  }

  function openFormDialog({ menuId, model, menuItem }) {
    activeModel.value = model

    if (menuItem) {
      activeId.value = menuItem._id
      menuForm.value = initOperationForm(menuItem)
    }

    if (menuId) {
      menuForm.value.menuId = menuId
      activeId.value = menuId
    }
    formDialogRef.value.status = true
  }

  function resetOperationForm() {
    const menuId = activeId.value
    formDialogRef.value.resetOperationForm()
    operationForm.value.menuId = menuId
  }

  function openConfirmDialog(model, id) {
    activeModel.value = model
    activeId.value = id
    confirmDialogRef.value.confirmDialogToggle()
  }

  onMounted(() => {
    menuStore.getMenusAndOperations()
  })

  return {
    operationForm,
    activeId,
    activeModel,
    menuStore,
    resetOperationForm,
  }
}
