import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUerStore = defineStore('user', () => {
  const customer = ref('6476f4088940f49853aa062e')
  const agent = ref('64741f07778d6a978ef85f10')

  return {
    customer,
    agent,
  }
})
