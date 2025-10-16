import { computed, onMounted, provide, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import catchAsync from '@/utils/catchAsync'

export function useUser({ tableRef, formDialogRef }) {
  const userStore = useUserStore()
  const userList = computed(() => userStore.list)

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
          agent: '',
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
    if (userItem) {
      active.value.data = userItem
      form.value = initForm(active.value.data)
    }
    formDialogRef.value.status = true
  }

  const create = catchAsync(async () => {})

  const update = catchAsync(async () => {})

  provide('user', {
    active,

    form,
    formRules,
    resetForm,
    cancelFormDialog,

    create,
    update,

    openFormDialog,
  })

  function cancelFormDialog() {
    form.value = initForm()
    active.value = initActive()
  }

  function resetForm() {}

  return { userList }
}
