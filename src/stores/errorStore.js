import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useErrorStore = defineStore('ErrorStore', () => {
  const errorActions = reactive({
    401: [],
  })

  return { errorActions }
})
