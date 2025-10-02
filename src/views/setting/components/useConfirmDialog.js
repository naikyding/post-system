import { ref } from 'vue'
import { deleteOperationAPI } from '@/api'
import catchAsync from '@/utils/catchAsync'
import { useMenusStore } from '@/stores/menus'

export const useConfirmDialog = () => {
  const menusStore = useMenusStore()
  const initMenuForm = () => ({
    sort: 0,
    status: true,
    icon: '',
    name: '',
    description: '',
    routeName: '',
    path: '',
    component: '',
  })
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
  const dialogStatus = ref(false)
  const model = ref('')
  const dialogText = ref({
    createMenu: '確定新增選單?',
    updateMenu: '確定修改選單?',
    deleteMenu: '刪除後，將無法回復?',
    createOperation: '確定新增操作?',
    updateOperation: '確定修改操作?',
    deleteOperation: '刪除後，將無法回復?',
  })
  const activeId = ref(null)
  const snackbarStatus = ref(false)

  const deleteOperation = catchAsync(async () => {
    const { status } = await deleteOperationAPI(activeId.value)

    if (status) {
      snackbarStatus.value = true
      menusStore.getMenusAndOperations()
      reset()
    }
  })

  const operations = ref({
    createMenu,
    updateMenu,
    deleteMenu,

    createOperation,
    updateOperation,
    deleteOperation,
  })

  const menuForm = ref(initMenuForm())
  const operationForm = ref(initOperationForm())

  function resetForm() {
    menuForm.value = initMenuForm()
    operationForm.value = initOperationForm()
  }

  function reset() {
    dialogStatus.value = false
    model.value = ''
    activeId.value = null
    resetForm()
  }

  function createMenu() {
    console.log('createMenu')
    console.log(menuForm.value)
    reset()
  }
  function updateMenu() {
    console.log('updateMenu')
    console.log(activeId.value, menuForm.value)
    reset()
  }
  function deleteMenu() {
    console.log('deleteMenu')
    console.log(activeId.value)
    reset()
  }
  function createOperation() {
    console.log('createOperation')
    console.log(operationForm.value)
    reset()
  }
  function updateOperation() {
    console.log('updateOperation')
    console.log(activeId.value, operationForm.value)
    reset()
  }

  return {
    dialogStatus,
    activeId,
    model,
    operations,
    dialogText,
    reset,
    snackbarStatus,
  }
}
