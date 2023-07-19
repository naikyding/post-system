import { ref, watchEffect, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI, refreshTokenAPI, gerUserBaseInfoAPI } from '@/api'
import catchAsync from '../utils/catchAsync'
import { errorFunction } from '../utils/catchAsync'
import router from '../router'
import Swal from 'sweetalert2'

export const useUserStore = defineStore('user', () => {
  const adminCustomer = ref('6476f4088940f49853aa062e')
  const token = ref({
    type: localStorage.getItem('type') || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  })
  // 登入狀態
  const isLogin = ref(false)
  // 使用者基本資料
  const baseInfo = ref([])

  const agents = computed(() => {
    return baseInfo.value.agents ? baseInfo.value.agents[0] : null
  })
  const roles = computed(() => {
    return baseInfo.value.roles ? baseInfo.value.roles[0] : null
  })

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
    const storeAccessToken = token.value.accessToken
    const storeAccessTokenType = token.value.type
    const storeRefreshToken = token.value.refreshToken

    let tokenObj = []

    // 如果 STORE 有資料
    if (storeAccessToken && storeAccessTokenType && storeRefreshToken) {
      tokenObj = {
        type: storeAccessTokenType,
        accessToken: storeAccessToken,
        refreshToken: storeRefreshToken,
      }

      return tokenObj
    }

    const accessToken = localStorage.getItem('accessToken')
    const type = localStorage.getItem('type')
    const refreshToken = localStorage.getItem('refreshToken')

    // 如果 local 有資料
    if (accessToken && type && refreshToken) {
      const tokenObj = {
        type,
        accessToken,
        refreshToken,
      }

      saveUserToken(tokenObj)
      return tokenObj
    }

    return false
  }

  const login = catchAsync(async (emailNPassword) => {
    const { data } = await loginAPI(emailNPassword)
    if (data) loginFunc(data)
    return true
  })

  const getUserBaseInfo = catchAsync(
    async () => {
      const { data } = await gerUserBaseInfoAPI()
      baseInfo.value = data
    },
    () => {
      console.log('getUserBaseInfo Error')
    },
  )

  const loginFunc = async (data) => {
    await saveUserToken(data)
    await getUserBaseInfo()

    Swal.fire({
      icon: 'success',
      title: '登入成功',
      width: '400px',
      timer: 1500,
      showConfirmButton: false,
    })

    router.push('/')
  }

  const logoutFunc = async (path) => {
    localStorage.removeItem('type')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    ;(token.value.type = null),
      (token.value.accessToken = null),
      (token.value.refreshToken = null),
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
      refreshTokenError(errors)
    },
  )

  return {
    adminCustomer,
    agents,
    roles,
    token,
    isLogin,
    baseInfo,

    login,
    logoutFunc,
    refreshToken,
    getUserBaseInfo,
    checkLocalTokenAndReturnAccessToken,
  }
})
