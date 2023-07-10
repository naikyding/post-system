import { reactive, ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI, refreshTokenAPI } from '@/api'
import catchAsync from '../utils/catchAsync'
import { errorFunction } from '../utils/catchAsync'
import router from '../router'
import Swal from 'sweetalert2'

export const useUserStore = defineStore('user', () => {
  const customer = ref('6476f4088940f49853aa062e')
  const agent = ref('64741f07778d6a978ef85f10')
  const token = ref({
    type: localStorage.getItem('type') || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  })

  const isLogin = ref(false)

  watchEffect(() => {
    if (token.value.accessToken && token.value.refreshToken && token.value.type) {
      isLogin.value = true
    } else isLogin.value = false
  })

  function saveUserToken(tokenData) {
    localStorage.removeItem('accessToken')
    Object.keys(tokenData).forEach((key) => {
      token.value[key] = tokenData[key]
      localStorage.setItem(key, tokenData[key])
    })
  }

  function checkLocalTokenAndReturnAccessToken() {
    const accessToken = localStorage.getItem('accessToken') || null
    const type = localStorage.getItem('type') || null
    const refreshToken = localStorage.getItem('refreshToken') || null

    if (accessToken && type && refreshToken) {
      const tokenObj = {
        type,
        accessToken,
        refreshToken,
      }

      loginFunc(tokenObj)
      return tokenObj
    }

    return false
  }

  const login = catchAsync(async (emailNPassword) => {
    const { data } = await loginAPI(emailNPassword)
    if (data) loginFunc(data)
    return true
  })

  const loginFunc = (data) => {
    saveUserToken(data)
  }

  const logoutFunc = (path) => {
    localStorage.removeItem('type')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    router.push(path)
  }

  const refreshTokenError = (errors) => {
    errorFunction(errors, '請重新登入')
    logoutFunc('/login')
    return false
  }

  const refreshToken = catchAsync(
    async (refreshTokenJson) => {
      const errorFunc = () => {
        Swal.fire({
          icon: 'error',
          title: '請重新登入',
          width: '400px',
          timer: 1500,
          showConfirmButton: false,
        })
        logoutFunc('/login')
        return false
      }

      // 如果沒有 refreshToken
      if (!refreshTokenJson.refreshToken) return errorFunc()

      const { data } = await refreshTokenAPI(refreshTokenJson)

      // 如果沒有 accessToken
      if (!data.accessToken) return errorFunc()

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
    token,
    isLogin,

    login,
    refreshToken,
    checkLocalTokenAndReturnAccessToken,
  }
})
