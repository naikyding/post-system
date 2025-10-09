import { onMounted, provide, ref, watch } from 'vue'
import { useRolesStore } from '@/stores/roles'
import { createRoleAPI, deleteRoleAPI, updateRoleAPI } from '@/api'
import catchAsync from '../../../utils/catchAsync'

export function useRoles({ tableRef, formDialogRef, confirmDialogRef }) {
  const rolesStore = useRolesStore()

  const initActive = () => ({
    id: null,
    model: null,
  })

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

  provide('role', {
    active,
    form,
    formRules,
    resetForm,

    openFormDialog,
    cancelFormDialog,
    openConfirmDialog,
    cancelConfirmDialog,

    create,
    update,
    deleteItem,
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
  })

  return { rolesStore, active }
}
