import { useMenusStore } from '@/stores/menus'
import { onMounted, provide, ref } from 'vue'
import {
  createOperationAPI,
  updateOperationAPI,
  deleteOperationAPI,
  // menu
  createMenuAPI,
  updateMenuAPI,
  deleteMenuAPI,
} from '@/api'
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
      parentId = '',
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
      parentId,
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
  provide('confirmDialog', {
    open: openConfirmDialog,
    cancel: cancelConfirmDialog,
  })

  function modelCheck(activeModel) {
    if (['createOperation', 'updateOperation'].includes(activeModel)) return 'operation'
    if (['createMenu', 'updateMenu'].includes(activeModel)) return 'menu'
  }

  const cancelDialogForm = () => {
    if (modelCheck(activeModel.value) === 'operation') {
      operationForm.value = initOperationForm()
    }
    if (modelCheck(activeModel.value) === 'menu') {
      menuForm.value = initMenuForm()
    }
    activeModel.value = null
    activeId.value = null

    formDialogRef.value.status = false
  }

  function resetFormAndGetMenus(status) {
    if (status) {
      cancelDialogForm()
      menuStore.getMenusAndOperations()
    }
  }

  const createOperation = catchAsync(async () => {
    const validateForm = await formDialogRef.value.validateOperationForm()
    if (validateForm) {
      const { status } = await createOperationAPI(operationForm.value)
      resetFormAndGetMenus(status)
    }
  })

  const updateOperation = catchAsync(async () => {
    const validateForm = await formDialogRef.value.validateOperationForm()
    if (validateForm) {
      const { status } = await updateOperationAPI(activeId.value, operationForm.value)
      resetFormAndGetMenus(status)
    }
  })

  const deleteOperation = catchAsync(async () => {
    const { status } = await deleteOperationAPI(activeId.value)
    if (status) {
      menuTableRef.value.openChildrenId = {}

      cancelDialogForm()
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
    cancelDialogForm,
  })

  const createMenu = catchAsync(async () => {
    const form = menuForm.value
    const validateForm = await formDialogRef.value.validateOperationForm()
    const allowInput = [
      'sort',
      'status',
      'icon',
      'name',
      'description',
      'routeName',
      'path',
      'component',
      'parentId',
    ]
    if (validateForm) {
      const payload = allowInput.reduce((acc, cur) => {
        if (form[cur] !== '') acc[cur] = form[cur]
        return acc
      }, {})

      const { status } = await createMenuAPI(payload)
      resetFormAndGetMenus(status)
    }
  })

  const updateMenu = catchAsync(async () => {
    const id = activeId.value
    const payload = menuForm.value
    const validateForm = await formDialogRef.value.validateOperationForm()

    if (validateForm) {
      const { status } = await updateMenuAPI(id, payload)
      resetFormAndGetMenus(status)
    }
  })

  const deleteMenu = catchAsync(async () => {
    const { status } = await deleteMenuAPI(activeId.value)

    if (status) {
      menuTableRef.value.openChildrenId = {}
      await menuStore.getMenusAndOperations()
      cancelConfirmDialog()
    }
  })

  provide('menu', {
    openConfirmDialog,
    openFormDialog,

    form: menuForm,
    createMenu,
    updateMenu,
    deleteMenu,
    cancelDialogForm,
  })

  function openOperationForm({ menuId, model, operationItem }) {
    activeModel.value = model

    if (operationItem) {
      activeId.value = operationItem._id
      operationForm.value = initOperationForm(operationItem)
    }

    if (menuId) {
      operationForm.value.menuId = menuId
    }
    formDialogRef.value.status = true
  }

  function openFormDialog({ parentId, model, menuItem }) {
    activeModel.value = model
    console.log(parentId)
    if (menuItem) {
      activeId.value = menuItem._id
      menuForm.value = initMenuForm(menuItem)
    }

    if (parentId) {
      menuForm.value.parentId = parentId
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
  function cancelConfirmDialog() {
    activeModel.value = null
    activeId.value = null
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
