import { onMounted, provide, ref, watch } from 'vue'
import { useRolesStore } from '@/stores/roles'
import { useMenusStore } from '@/stores/menus'
import { createRoleAPI, deleteRoleAPI, updateRoleAPI } from '@/api'
import { useRouterStore } from '../../../stores/router'
import catchAsync from '@/utils/catchAsync'
import router from '@/router'

export function useRoles({ tableRef, formDialogRef, confirmDialogRef, menuAndOperationDrawerRef }) {
  const rolesStore = useRolesStore()
  const menusStore = useMenusStore()

  const initActive = () => ({
    id: null,
    model: null,
    item: {},
  })

  const initMenusAndOperations = ({ model = '', menus = [], operations = [] } = {}) => {
    if (!model) return { menus: [...menus], operations: [...operations] }
    if (model === 'menus') return [...menus]
    if (model === 'operations') return [...operations]
  }

  const menusForm = ref(initMenusAndOperations({ model: 'menus' }))
  const operationsForm = ref(initMenusAndOperations({ model: 'operations' }))

  const initForm = (payload = {}) => {
    const { name = '', code = '', status = true, isSystem = true, description = '' } = payload
    return { name, code, status, isSystem, description }
  }

  const active = ref(initActive())
  const form = ref(initForm())

  const formRules = {
    required: (value) => !!value || '必須項目',
  }

  const create = catchAsync(async () => {
    afterValidateSuccessCallApi(() => createRoleAPI(form.value))
  })

  const update = catchAsync(async () => {
    const id = active.value.id
    const payload = form.value

    afterValidateSuccessCallApi(() => updateRoleAPI(id, payload))
  })

  const afterValidateSuccessCallApi = catchAsync(async (func = () => {}, callback = () => {}) => {
    const validate = await validateForm()
    if (validate) {
      const { status } = await func()
      resToDo(status)
      callback()
    }
  })

  const deleteItem = catchAsync(async () => {
    const id = active.value.id
    cancelConfirmDialog()
    const { status } = await deleteRoleAPI(id)

    if (status) {
      rolesStore.getList()
    }
  })

  const updateMenusAndOperations = catchAsync(async () => {
    const routerStore = useRouterStore()
    const id = active.value.id
    const payload = { menus: [...menusForm.value], operations: [...operationsForm.value] }

    const { status } = await updateRoleAPI(id, payload)
    if (status) {
      rolesStore.getList()
      const routes = await routerStore.generateRoutes()
      routes.forEach((route) => {
        router.addRoute('root', route)
      })
      // 重新進入當前路由，觸發匹配
      router.replace(router.currentRoute.value.fullPath)
    }
    closeMenuAndOperationDrawer()
  })

  provide('role', {
    active,
    form,
    formRules,
    resetForm,
    menusForm,
    operationsForm,

    openFormDialog,
    cancelFormDialog,

    openConfirmDialog,
    cancelConfirmDialog,

    openMenuAndOperationDrawer,
    closeMenuAndOperationDrawer,

    create,
    update,
    deleteItem,

    updateMenusAndOperations,
  })

  watch(
    () => confirmDialogRef.value?.status,
    (newStatus, oldStatus) => {
      if (oldStatus && !newStatus) cancelConfirmDialog()
    },
  )

  watch(
    () => formDialogRef.value?.status,
    (newStatus, oldStatus) => {
      if (oldStatus && !newStatus) cancelFormDialog()
    },
  )

  watch(
    () => menuAndOperationDrawerRef.value?.status,
    (newStatus, oldStatus) => {
      if (oldStatus && !newStatus) closeMenuAndOperationDrawer()
    },
  )

  function closeMenuAndOperationDrawer() {
    active.value = initActive()

    menuAndOperationDrawerRef.value.status = false
    const { menus, operations } = initMenusAndOperations()
    menusForm.value = menus
    operationsForm.value = operations
  }

  function openMenuAndOperationDrawer({ model, roleItem }) {
    active.value.model = model
    active.value.id = roleItem._id
    active.value.item = roleItem

    const { menus, operations } = initMenusAndOperations({
      menus: [...active.value.item.menus],
      operations: [...active.value.item.operations],
    })

    menusForm.value = menus
    operationsForm.value = operations

    menuAndOperationDrawerRef.value.status = true
  }

  function openConfirmDialog({ model, id }) {
    active.value.id = id
    active.value.model = model
    confirmDialogRef.value.status = true
  }

  function cancelConfirmDialog() {
    active.value = initActive()
    confirmDialogRef.value.status = false
  }

  function resToDo(status) {
    if (status) {
      rolesStore.getList()
      cancelFormDialog()
    }
  }

  async function validateForm() {
    const { valid } = await formDialogRef.value.form.validate()
    return valid
  }

  function openFormDialog({ model = '', roleItem = {} }) {
    active.value.model = model

    // 修改模式
    if (Object.keys(roleItem).length > 0) {
      active.value.id = roleItem._id
      form.value = initForm(roleItem)
    }
    formDialogRef.value.status = true
  }

  function cancelFormDialog() {
    formDialogRef.value.status = false
    active.value = initActive()
    resetForm()
  }

  function resetForm() {
    formDialogRef.value.form.reset()
    form.value = initForm()
  }

  onMounted(() => {
    rolesStore.getList()
    menusStore.getMenusAndOperations()
  })

  return { rolesStore, active }
}
