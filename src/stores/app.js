import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'

export const useAppStore = defineStore('App', () => {
  const statusDialog = reactive({
    status: false,
    type: 'info', // success. info.  warning. error
    title: '--',
    text: '--',
  })

  function resStatusDialog({ status, type, title, text }) {
    const titleRes = status ? '操作成功' : '操作失敗'
    const typeRes = type ? type : status ? 'success' : 'error'

    statusDialog.status = true
    statusDialog.type = typeRes
    statusDialog.title = title || titleRes
    statusDialog.text = text || '--'
  }

  // 監聽 statusDialog 自動關閉
  watch(
    () => statusDialog.status,
    (newStatus) => {
      if (newStatus) {
        setTimeout(() => {
          statusDialog.status = false
        }, 2000)
      }
    },
  )

  return { statusDialog, resStatusDialog }
})
