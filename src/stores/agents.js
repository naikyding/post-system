import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAgentsAPI } from '@/api'
import catchAsync from '@/utils/catchAsync'
7

export const useAgentStore = defineStore('Agent', () => {
  const list = ref([])

  const getAgents = catchAsync(async () => {
    const { status, data } = await getAgentsAPI()
    if (status) {
      list.value = data.items
      return true
    }

    return false
  })

  return { list, getAgents }
})
