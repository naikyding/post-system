import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import catchAsync from '@/utils/catchAsync'
import { useRolesStore } from '@/stores/roles'
import { isLength, isEmail } from 'validator'
import { createUserAPI, deleteUserAPI } from '@/api'

export function useUser({ tableRef, formDialogRef, confirmDialogRef }) {
  const userStore = useUserStore()
  const userList = computed(() => userStore.list)

  const roleStore = useRolesStore()

  const initActive = () => ({
    id: null,
    model: null,
    data: null,
  })

  function initForm(data = {}) {
    const defaultForm = {
      email: '',
      password: '',
      agentRoles: [
        {
          agent: localStorage.getItem('agentsId'),
          roles: [],
        },
      ],
      nickname: '',
      avatar: '',
      phone: '',
      note: '',
    }

    // 特別處理 agentRoles，避免直接被覆蓋掉結構
    return {
      ...defaultForm,
      ...data,
      agentRoles: data.agentRoles
        ? data.agentRoles.map((item) => ({
            agent: item.agent || '',
            roles: item.roles || [],
          }))
        : defaultForm.agentRoles,
    }
  }

  const formRules = {
    required: (value) => !!value || '必須項目',
    email: (email) => isEmail(email) || '格式錯誤',
    nickname: (name) => isLength(name, { min: 2 }) || '請輸入至少 2 字元',
    roles: (roles) => roles.length > 0 || '至少選擇一個角色',
    password: (psw) => isLength(psw, { min: 8 }) || '至少 8 字元長度',
  }

  const active = ref(initActive())
  const form = ref(initForm())

  onMounted(() => {
    userStore.getUserList()
  })

  watch(
    () => formDialogRef.value?.status,
    (newStatus, oldStatus) => {
      if (oldStatus && !newStatus) {
        cancelFormDialog()
      }
    },
  )
  watch(
    () => confirmDialogRef.value?.status,
    (newStatus, oldStatus) => {
      if (oldStatus && !newStatus) {
        cancelConfirmDialog()
      }
    },
  )

  const openFormDialog = ({ model, userItem }) => {
    active.value.model = model
    roleStore.getList('all')

    if (userItem) {
      active.value.data = userItem
      form.value = initForm(active.value.data)
    }

    formDialogRef.value.status = true
  }

  const roleList = computed(() => roleStore.list)

  const create = catchAsync(async () => {
    const { valid } = await formDialogRef.value.form.validate()
    if (valid) {
      const { status } = await createUserAPI(form.value)
      if (status) {
        cancelFormDialog()
        userStore.getUserList()
      }
    }
  })

  const update = catchAsync(async () => {})
  const deleteItem = catchAsync(async () => {
    const userId = active.value.id
    if (!userId) return false

    const { status } = await deleteUserAPI(userId)
    if (status) {
      cancelConfirmDialog()
      userStore.getUserList()
    }
  })

  provide('user', {
    active,
    roleList,

    form,
    formRules,
    resetForm,
    cancelFormDialog,

    openConfirmDialog,
    cancelConfirmDialog,
    deleteItem,

    create,
    update,

    openFormDialog,
  })

  function openConfirmDialog({ model, id, data }) {
    active.value.id = id
    active.value.model = model
    active.value.data = data
    confirmDialogRef.value.status = true
  }

  function cancelConfirmDialog() {
    confirmDialogRef.value.status = false
    active.value = initActive()
  }

  function cancelFormDialog() {
    formDialogRef.value.status = false
    form.value = initForm()
    active.value = initActive()
  }

  async function resetForm() {
    form.value = initForm(active.value?.data || '')
    await nextTick()
    formDialogRef.value.form.resetValidation()
  }

  return { userList }
}
