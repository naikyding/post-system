import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'

export const useAppStore = defineStore('App', () => {
  const progressStatus = ref(false)

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

  return { resStatusDialog, progressStatus }
})
