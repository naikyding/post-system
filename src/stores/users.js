import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI, refreshTokenAPI } from '@/api'
import catchAsync from '../utils/catchAsync'
import { errorFunction } from '../utils/catchAsync'
import router from '../router'
import Swal from 'sweetalert2'

export const useUerStore = defineStore('user', () => {
  const customer = ref('6476f4088940f49853aa062e')
  const agent = ref('64741f07778d6a978ef85f10')
  const token = ref({
    type: localStorage.getItem('accessTokenType') || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  })

  function saveUserToken(tokenData) {
    localStorage.removeItem('accessToken')
    Object.keys(tokenData).forEach((key) => {
      token.value[key] = tokenData[key]
      localStorage.setItem(key, tokenData[key])
    })
  }

  const login = catchAsync(async (emailNPassword) => {
    const { data } = await loginAPI(emailNPassword)
    if (data) saveUserToken(data)
    return true
  })

  const logout = (path) => {
    localStorage.removeItem('type')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    router.push(path)
  }

  const refreshTokenError = (errors) => {
    errorFunction(errors, '請重新登入')
    logout('/login')
  }

  const refreshToken = catchAsync(
    async (refreshTokenJson) => {
      if (!refreshTokenJson.refreshToken) {
        Swal.fire({
          icon: 'error',
          title: '請重新登入',
          width: '400px',
          timer: 1500,
          showConfirmButton: false,
        })
        logout('/login')
        return false
      }

      const { data } = await refreshTokenAPI(refreshTokenJson)
      saveUserToken(data)
      return data.refreshToken
    },
    (errors) => {
      console.log(123)
      refreshTokenError(errors)
    },
  )

  return {
    customer,
    agent,

    login,
    token,
    refreshToken,
  }
})
