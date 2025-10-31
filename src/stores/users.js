import { ref, watchEffect, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI, refreshTokenAPI, gerUserBaseInfoAPI } from '@/api'
import catchAsync from '../utils/catchAsync'
import { errorFunction } from '../utils/catchAsync'
import router from '../router'
import Swal from 'sweetalert2'
import { useRouterStore } from '@/stores/router'

export const useUserStore = defineStore('user', () => {
  const routerStore = useRouterStore()
  const adminCustomer = ref('6476f4088940f49853aa062e')
  const token = ref({
    type: localStorage.getItem('type') || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  })
  // 登入狀態
  const isLogin = ref(false)
  // 使用者基本資料
  const baseInfo = ref({
    agentRoles: [],
  })

  // user routes
  const routes = ref([])

  const agents = computed(() => {
    return localStorage.getItem('agentsId')
  })

  const roles = computed(() => {
    return baseInfo?.value?.agentRoles[0].roles[0]
  })

  const activeAgentData = computed(() =>
    baseInfo.value?.agentRoles.find(
      (item) => String(item.agent._id) === String(activeAgentId.value) || null,
    ),
  )

  function initActiveAgentId() {
    return localStorage.getItem('activeAgentId')
  }
  function initActiveRoleId() {
    return localStorage.getItem('activeRoleId')
  }

  const activeAgentId = ref(initActiveAgentId() || null)
  const activeRoleId = ref(initActiveRoleId() || null)

  watch(activeRoleId, (newValue) => {
    if (newValue) routerStore.generateRoutes()
  })

  watch(activeAgentId, (newVal) => {
    if (newVal) localStorage.setItem('activeAgentId', newVal)
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
    if (data) await loginFunc(data)
    return true
  })

  const checkPassword = catchAsync(async (emailNPassword) => {
    const { data } = await loginAPI(emailNPassword)

    if (data) return true
    return false
  })

  function saveActiveAgentId(id) {
    activeAgentId.value = id
    localStorage.setItem('activeAgentId', id)
  }

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
  }

  const logoutFunc = async (path) => {
    const routerStore = useRouterStore()
    routerStore.generateRoutesStatus = false
    activeAgentId.value = null
    activeRoleId.value = null
    localStorage.removeItem('type')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('agentsId')
    localStorage.removeItem('activeRoleId')
    localStorage.removeItem('activeAgentId')
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
    routes,

    login,
    checkPassword,
    logoutFunc,
    refreshToken,
    getUserBaseInfo,
    checkLocalTokenAndReturnAccessToken,
    activeRoleId,
    activeAgentId,
    saveActiveAgentId,
    activeAgentData,
  }
})
