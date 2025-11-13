import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import catchAsync from '@/utils/catchAsync'
import { useRolesStore } from '@/stores/roles'
import { isLength, isEmail } from 'validator'
import { useAgentStore } from '@/stores/agents'
import { createUserAPI, deleteUserAPI, updateUserAPI, updateUserPasswordAPI } from '@/api'
import { useDialogController } from '@/stores/dialogController'

export function useUser({ tableRef, formDialogRef, confirmDialogRef }) {
  const dialogController = useDialogController()
  const userStore = useUserStore()
  const userList = computed(() => userStore.list)
  const agentStore = useAgentStore()

  const roleStore = useRolesStore()

  const initActive = () => ({
    id: null,
    model: null,
    data: null,
  })

  const initPwdForm = () => ({
    oldPassword: '',
    newPassword: '',
  })

  const pwdForm = ref(initPwdForm())

  function initForm(data = {}) {
    const defaultForm = {
      email: '',
      password: '',
      agentRoles: [
        {
          agent: null,
          roles: [],
        },
      ],
      nickname: '',
      avatar: '',
      phone: '',
      note: '',
    }

    // 定義允許的欄位
    const allowedKeys = Object.keys(defaultForm)
    const formatData = {}

    data.agentRoles
      ? allowedKeys.forEach((key) => {
          if (key === 'agentRoles') {
            formatData[key] = data['agentRoles'].map((item) => {
              return {
                agent: item.agent._id,
                roles: item.roles.map((role) => role._id),
              }
            })
          } else formatData[key] = data[key]
        })
      : defaultForm

    return {
      ...defaultForm,
      ...formatData,
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

  const agentList = computed(() => agentStore.list)

  function filterRolesByAgent(agentId, roleList) {
    return roleList.filter((role) => role.dataScopeRefs.includes(agentId))
  }

  onMounted(() => {
    userStore.getUserList('all')
    roleStore.getList()
    agentStore.getAgents()
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

  function agentSelectDynamicDisableCheck(agentId, index) {
    return form.value.agentRoles.some((item, i) => {
      return item.agent === agentId && i !== index
    })
  }

  function addAgentRolesItem() {
    form.value.agentRoles.push({
      agent: null,
      roles: [],
    })
  }

  function agentChange(agentRoles, index) {
    if (
      agentRoles.find(
        (item, itemIndex) => item.agent === agentRoles[index].agent && itemIndex !== index,
      )
    )
      console.log('有相同商家')

    agentRoles[index]['roles'].length = 0
  }

  const openFormDialog = ({ model, userItem }) => {
    active.value.model = model
    if (userItem) {
      active.value.data = userItem
      active.value.id = userItem._id
    }

    if (model === 'delete') {
      confirmDialogRef.value.status = true
    } else {
      form.value = initForm()
      form.value = initForm(userItem)
      formDialogRef.value.status = true
    }
  }

  function openConfirmDialog({ model, id, data }) {
    active.value.id = id
    active.value.model = model
    active.value.data = data
  }

  const roleList = computed(() => roleStore.list)

  const create = catchAsync(async () => {
    const { valid } = await formDialogRef.value.form.validate()
    if (valid) {
      const { status } = await createUserAPI(form.value)
      createAndUpdateSuccess(status)
    }
  })

  const update = catchAsync(async () => {
    const { valid } = await formDialogRef.value.form.validate()
    const agentId = active.value.id
    const update = { ...form.value }
    if (valid) {
      delete update.password

      const { status } = await updateUserAPI(agentId, form.value)
      createAndUpdateSuccess(status)
    }
  })

  function createAndUpdateSuccess(status) {
    if (status) {
      cancelFormDialog()
      userStore.getUserList('all')
    }
  }

  const deleteItem = catchAsync(async () => {
    const userId = active.value.id
    if (!userId) return false

    const { status } = await deleteUserAPI(userId)
    if (status) {
      cancelConfirmDialog()
      userStore.getUserList('all')
    }
  })

  const password = catchAsync(async () => {
    const { valid } = await formDialogRef.value.form.validate()
    const userId = active.value.id

    if (valid) {
      const { status } = await updateUserPasswordAPI(userId, pwdForm.value)
      createAndUpdateSuccess(status)
    }

    //
  })

  function deleteFormAgentRolesItem(agentRolesItem) {
    if (form.value.agentRoles.length <= 1)
      return dialogController.setStatusBar({
        status: true,
        text: '至少選擇一個角色',
        color: 'pink',
      })
    form.value.agentRoles = form.value.agentRoles.filter((item) => item !== agentRolesItem)
  }

  provide('user', {
    agentSelectDynamicDisableCheck,
    agentChange,
    active,
    roleList,
    addAgentRolesItem,
    deleteFormAgentRolesItem,

    filterRolesByAgent,

    agentList,

    form,
    formRules,
    resetForm,
    cancelFormDialog,

    pwdForm,
    password,

    openConfirmDialog,
    cancelConfirmDialog,
    deleteItem,

    create,
    update,

    openFormDialog,
  })

  function cancelConfirmDialog() {
    confirmDialogRef.value.status = false
    active.value = initActive()
  }

  function cancelFormDialog() {
    formDialogRef.value.status = false
    form.value = initForm()
    active.value = initActive()
    pwdForm.value = initPwdForm()
  }

  async function resetForm() {
    form.value = initForm(active.value?.data || '')
    await nextTick()
    formDialogRef.value.form.resetValidation()
  }

  return { userList }
}
