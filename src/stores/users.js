import { ref } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI } from '@/api'
import catchAsync from '../utils/catchAsync'
import { errorFunction } from '../utils/catchAsync'

export const useUerStore = defineStore('user', () => {
  const customer = ref('6476f4088940f49853aa062e')
  const agent = ref('64741f07778d6a978ef85f10')

  const login = catchAsync(async (emailNPassword) => {
    const { data } = await loginAPI(emailNPassword)
    return data
  })

  return {
    customer,
    agent,

    login,
  }
})
