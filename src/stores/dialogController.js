import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogController = defineStore('dialog-controller', () => {
  const eventStatusBar = ref({
    status: false,
    text: '--',
    color: 'success',
    timeout: 2000,
  })

  function setStatusBar({ status, text, color, timeout }) {
    eventStatusBar.value.status = status
    eventStatusBar.value.text = text
    eventStatusBar.value.color = color || 'success'
    eventStatusBar.value.timeout = timeout || 2000
  }

  return {
    eventStatusBar,
    setStatusBar,
  }
})
