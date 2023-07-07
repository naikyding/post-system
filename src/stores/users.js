import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI, refreshTokenAPI } from '@/api'
import catchAsync from '../utils/catchAsync'
import { errorFunction } from '../utils/catchAsync'

export const useUerStore = defineStore('user', () => {
  const customer = ref('6476f4088940f49853aa062e')
  const agent = ref('64741f07778d6a978ef85f10')
  const token = ref({
    type: localStorage.getItem('accessTokenType') || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  })

  function saveUserToken(tokenData) {
    token.value = tokenData
    Object.keys(tokenData).forEach((key) => {
      localStorage.setItem(key, tokenData[key])
    })
  }

  const login = catchAsync(async (emailNPassword) => {
    const { data } = await loginAPI(emailNPassword)
    if (data) saveUserToken(data)
    return true
  })

  const refreshToken = catchAsync(async (refreshToken) => {
    refreshTokenAPI(refreshToken)
  })

  return {
    customer,
    agent,

    login,
    token,
    refreshToken,
  }
})
