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
    { title: '圖片', key: 'image' },
    { title: 'ID', key: '_id' },
    { title: '名稱', key: 'name' },
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
    else if (activeModel.value === 'createUser') return '新增用戶'
    else if (activeModel.value === 'editAgent') return '修改商家'
    return '--'
  })
  const formDialog = ref({
    title,
  })

  function initForm({ name = '', description = '', image = '' } = {}) {
    return {
      name,
      description,
      image,
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

  function openDialog({ model, id, item }) {
    activeModel.value = model
    activeId.value = id
    if (model === 'deleteAgent') {
      ConfirmDialogRef.value.status = true
    } else {
      if (model === 'editAgent') {
        activeItem.value = item
        form.value = initForm({
          name: item.name,
          description: item.description,
          image: item.image,
        })
      }
      formDialogRef.value.status = true
    }
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

  function createUser() {
    console.log('addUser')
  }

  const editAgent = catchAsync(async () => {
    console.log('editAgent')
    const { valid } = await formRef.value.validate()

    if (valid) {
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
    items,
    formDialog,
    activeModel,
    form,
    cancelConfirmDialog,
    saveConfirmDialog,
    rules,
  }
}
