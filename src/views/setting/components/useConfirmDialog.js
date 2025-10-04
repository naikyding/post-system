import { ref } from 'vue'

export const useConfirmDialog = () => {
  const dialogText = ref({
    createMenu: '確定新增選單?',
    updateMenu: '確定修改選單?',
    deleteMenu: '刪除後，將無法回復?',
    createOperation: '確定新增操作?',
    updateOperation: '確定修改操作?',
    deleteOperation: '刪除後，將無法回復?',
  })

  return {
    dialogText,
  }
}
