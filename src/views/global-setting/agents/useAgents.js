import { useAgentStore } from '@/stores/agents'
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'
import { createAgentAPI, deleteAgentAPI, updateAgentAPI } from '@/api'
import catchAsync from '@/utils/catchAsync'
import { useClipboard } from '@vueuse/core'
import { useDialogController } from '@/stores/dialogController'

export function useAgents({ formDialogRef, ConfirmDialogRef, formRef }) {
  const agentStore = useAgentStore()
  const dialogController = useDialogController()

  const { copy, copied, isSupported } = useClipboard()
  async function handelCopyId(id) {
    if (isSupported.value) {
      await copy(id)
    }
    if (copied.value) {
      dialogController.setStatusBar({ status: true, text: '復製成功' })
    }
  }

  const headers = [
    { title: '狀態', key: 'status' },
    { title: '名稱', key: 'name' },
    { title: '代碼', key: 'code' },
    { title: '所屬總店', key: 'parentAgent' },
    { title: '說明', key: 'description' },
    { title: '操作', key: 'actions' },
  ]

  const activeModel = ref(null)
  const activeId = ref(null)
  const activeItem = ref({})

  function initActive() {
    activeModel.value = null
    activeId.value = null
    activeItem.value = {}
  }

  function resetForm() {
    form.value = initForm()
  }

  function getAgentList() {
    agentStore.getAgents()
  }

  const title = computed(() => {
    if (activeModel.value === 'createAgent') return '新增商家'
    else if (activeModel.value === 'createAgentFromMasterAgent')
      return `新增 ${form.value.parentAgent.name} 分店`
    else if (activeModel.value === 'editAgent') return '修改商家'
    return '--'
  })
  const formDialog = ref({
    title,
  })

  async function createAgentFromMasterAgent() {
    console.log('createAgentFromMasterAgent')
    const { valid } = await formRef.value.validate()
    if (valid) {
      form.value.parentAgent = form.value.parentAgent._id
      const { status } = await createAgentAPI(form.value)
      if (status) {
        closeDialog()
        getAgentList()
      }
    }
  }

  const defaultForm = {
    name: '',
    description: '',
    image: '',
    code: '',
    status: 'active',
    parentAgent: null,
  }

  function initForm(data = {}) {
    return {
      ...defaultForm,
      ...data,
    }
  }

  const form = ref(initForm())

  const rules = {
    required: (value) => !!value || '必填項目',
  }

  watch(
    () => formDialogRef.value?.status,
    (newStatus, oldStatus) => {
      if (!newStatus && oldStatus) {
        initActive()
        resetForm()
      }
    },
  )

  function openFormDialog() {
    formDialogRef.value.status = true
  }

  function openDialog({ model, id, item }) {
    activeModel.value = model
    activeId.value = id

    const actionMap = {
      createAgentFromMasterAgent: () => {
        form.value.parentAgent = item
        openFormDialog()
      },

      editAgent: () => {
        activeItem.value = item
        form.value = initForm({
          name: item.name,
          description: item.description,
          image: item.image,
          status: item.status,
          code: item.code,
          parentAgent: item.parentAgent,
        })
        openFormDialog()
      },

      createAgent: () => {
        openFormDialog()
      },

      deleteAgent: () => {
        ConfirmDialogRef.value.status = true
      },
    }

    actionMap[model]?.()
  }

  function resetDialog() {
    form.value = initForm(activeItem.value)
    nextTick(() => {
      formRef.value.resetValidation()
    })
  }

  function closeDialog() {
    formDialogRef.value.status = false
    resetState()
  }

  function resetState() {
    initActive()
    resetForm()
  }

  const createAgent = catchAsync(async () => {
    const { valid } = await formRef.value.validate()

    if (valid) {
      const { status } = await createAgentAPI(form.value)
      if (status) {
        closeDialog()
        getAgentList()
      }
    }
  })

  function updateToMasterAgent(form) {
    form.parentAgent = null
  }

  function createUser() {
    console.log('addUser')
  }

  const editAgent = catchAsync(async () => {
    123
    const { valid } = await formRef.value.validate()

    if (valid) {
      if (form.value.parentAgent?._id) {
        form.value.parentAgent = form.value.parentAgent._id
      }
      const { status } = await updateAgentAPI(activeId.value, form.value)
      if (status) {
        closeDialog()
        getAgentList()
      }
    }
  })

  function deleteAgent() {
    console.log('deleteAgent')
  }

  function cancelConfirmDialog() {
    initActive()
  }

  const saveConfirmDialog = catchAsync(async () => {
    const { status } = await deleteAgentAPI(activeId.value)
    if (status) {
      getAgentList()
      initActive()
      dialogController.setStatusBar({ status: true, text: '刪除成功' })
    }
  })

  provide('agent', {
    activeModel,
    activeId,

    openDialog,
    closeDialog,
    resetDialog,

    createAgent,
    createAgentFromMasterAgent,
    createUser,
    editAgent,
    deleteAgent,

    form,
    handelCopyId,
  })

  const items = computed(() => agentStore.list)

  onMounted(() => {
    getAgentList()
  })

  return {
    headers,
    updateToMasterAgent,
    items,
    formDialog,
    activeModel,
    form,
    cancelConfirmDialog,
    saveConfirmDialog,
    rules,
  }
}
