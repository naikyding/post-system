import { computed, onMounted, provide, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import catchAsync from '@/utils/catchAsync'
import { useRolesStore } from '@/stores/roles'

export function useUser({ tableRef, formDialogRef }) {
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

  const openFormDialog = ({ model, userItem }) => {
    active.value.model = model
    roleStore.getList('all')

    if (userItem) {
      active.value.data = userItem
      form.value = initForm(active.value.data)
    }

    formDialogRef.value.status = true
  }

  const create = catchAsync(async () => {})

  const update = catchAsync(async () => {})
  const roleList = computed(() => roleStore.list)

  provide('user', {
    active,
    roleList,

    form,
    formRules,
    resetForm,
    cancelFormDialog,

    create,
    update,

    openFormDialog,
  })

  function cancelFormDialog() {
    formDialogRef.value.status = false
    form.value = initForm()
    active.value = initActive()
  }

  function resetForm() {
    form.value = initForm(active.value?.data || '')
    formDialogRef.value.form.resetValidation()
  }

  return { userList }
}
