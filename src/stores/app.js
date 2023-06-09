import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import Swal from 'sweetalert2'

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

    Swal.fire({
      icon: typeRes,
      title: title || titleRes,
      text: text || '--',
      showConfirmButton: false,
      timer: 1500,
      width: '400px',
    })
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
