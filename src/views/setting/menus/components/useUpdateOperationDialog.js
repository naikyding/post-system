import { ref } from 'vue'

export const useUpdateOperationDialog = () => {
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

  const form = ref(initOperationForm())
  function resetForm() {}

  return { form, resetForm }
}
