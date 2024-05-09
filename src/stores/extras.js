import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getExtrasAPI } from '@/api'
import catchAsync from '../utils/catchAsync'

export const useExtrasStore = defineStore('extras', () => {
  const extras = ref([])

  const getExtrasList = catchAsync(async () => {
    const { data } = await getExtrasAPI()
    if (data) {
      extras.value.length = 0
      extras.value = data.items
    }
  })

  return {
    extras,
    getExtrasList,
  }
})
