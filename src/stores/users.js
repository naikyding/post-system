import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI } from '@/api'
import catchAsync from '../utils/catchAsync'
import { errorFunction } from '../utils/catchAsync'

export const useUerStore = defineStore('user', () => {
  const customer = ref('6476f4088940f49853aa062e')
  const agent = ref('64741f07778d6a978ef85f10')
  const token = ref({
    type: null,
    accessToken: null,
    refreshToken: null,
  })

  function saveUserToken(data) {
    token.value = data
    localStorage.setItem('accessToken', token.value.accessToken)
    localStorage.setItem('accessTokenType', token.value.type)
    localStorage.setItem('refreshToken', token.value.refreshToken)
  }

  const login = catchAsync(async (emailNPassword) => {
    const { data } = await loginAPI(emailNPassword)
    if (data) saveUserToken(data)
    return true
  })

  return {
    customer,
    agent,

    login,
    token,
  }
})
