import { useMenusStore } from '@/stores/menus'
import { onMounted, provide, ref } from 'vue'
import { createOperationAPI } from '@/api'
import catchAsync from '../../utils/catchAsync'

const menuStore = useMenusStore()

export function useMenus(operationFormDialogRef) {
  const initOperationForm = () => ({
    // 顯示名稱
    name: '',
    // 說明
    description: '',
    // 哪個路由使用
    menuId: '', // 設定頁id
    // 操作項目名稱
    operate: '',
    // 操作動作
    action: '',
  })

  const resetOperation = () => {
    operationForm.value = initOperationForm()
    activeModel.value = null
    activeId.value = null
    operationFormDialogRef.value.status = false
  }

  const operationForm = ref(initOperationForm())

  const activeId = ref(null)
  const activeModel = ref(null)

  provide('activeId', {
    id: activeId,
    saveActiveId,
  })

  const createOperation = catchAsync(async () => {
    const { status } = await createOperationAPI(operationForm.value)
    if (status) {
      resetOperation()
      menuStore.getMenusAndOperations()
    }
  })

  provide('operation', {
    model: activeModel,
    form: operationForm,
    openOperationForm,
    createOperation,
    updateOperation,
  })

  function updateOperation(id) {
    console.log(id)
  }

  function openOperationForm({ menuId, model }) {
    operationFormDialogRef.value.status = true
    operationForm.value.menuId = menuId
    activeModel.value = model
  }

  function saveActiveId(id) {
    activeId.value = id
  }

  onMounted(() => {
    menuStore.getMenusAndOperations()
  })

  return {
    operationForm,
    activeId,
    activeModel,
    menuStore,
    saveActiveId,
  }
}
