import { defineStore } from 'pinia'
import { ref } from 'vue'
import catchAsync from '../utils/catchAsync'
import { getUsersAPI } from '@/api'

export const useUserStore = defineStore('User', () => {
  const list = ref([])

  const getUserList = catchAsync(async () => {
    const { status, data } = await getUsersAPI()
    if (status) {
      list.value = data.items
    }
  })

  return { list, getUserList }
})
