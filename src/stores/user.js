import { defineStore } from 'pinia'
import { ref } from 'vue'
import catchAsync from '../utils/catchAsync'
import { getUsersAPI, getUsersAllAPI } from '@/api'

export const useUserStore = defineStore('User', () => {
  const list = ref([])

  const getUserList = catchAsync(async (type) => {
    list.value.length = 0
    const { status, data } = type ? await getUsersAllAPI() : await getUsersAPI()
    if (status) {
      list.value = data.items
    }
  })

  return { list, getUserList }
})
