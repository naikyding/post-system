import axios from 'axios'
import { useAppStore } from '../stores/app'
import { useUserStore } from '../stores/users.js'

let retry = false

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
})

// Interceptors ((REQUEST))
request.interceptors.request.use(
  async function (config) {
    // loading display
    const appStore = useAppStore()
    appStore.progressStatus = true

    const userStore = useUserStore()

    // 設置 header authorization
    const { type, accessToken } = await userStore.checkLocalTokenAndReturnAccessToken()
    if (accessToken && type) {
      config.headers.Authorization = `${type} ${accessToken}`
    }

    if (localStorage.getItem('agentsId')) {
      config.headers['Mc-Agents-Id'] = userStore.agents
      config.headers['mc-agent-id'] = userStore.agents
    }

    return config
  },
  function (error) {
    // Do something with request error

    return Promise.reject(error)
  },
)

// Interceptors ((RESPONSE))
request.interceptors.response.use(
  // success handler
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    const appStore = useAppStore()
    appStore.progressStatus = false
    console.log(
      `%c✅ ${response.status} Response: `,
      'background: #04BFBF; border-radius: 4px; padding: .3rem 1rem;',
      response.data,
    )
    return response.data
  },
  // error handler
  async (error) => {
    // loading display
    const appStore = useAppStore()
    appStore.progressStatus = false

    // 請求的內容
    const originalRequest = error.config

    // 請求逾時
    if (error.code === 'ECONNABORTED') {
      error.message = error.message + ' (請求逾時)'
      return Promise.reject(error)
    } else {
      console.error('其他錯誤', error)
    }

    // 如果 401 且沒有重新請求過
    if (error.response.status === 401 && !retry) {
      const userStore = useUserStore()

      // 如果 refresh token 401
      if (
        originalRequest.url === '/auth/refresh-token' &&
        error.response.data.message === 'Unauthorized'
      ) {
        return userStore.logoutFunc('/login')
      }
      if (originalRequest.url === '/auth/login') return Promise.reject(error)

      // 刷新 token
      await userStore.refreshToken({
        refreshToken: userStore.token.refreshToken,
      })
      // 設置 header authorization
      const { type, accessToken } = await userStore.checkLocalTokenAndReturnAccessToken()
      if (accessToken && type) {
        error.config.headers.Authorization = `${type} ${accessToken}`

        // 重新請求失敗的 request
        const response = await request(originalRequest)

        return response
      }
    } // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default request
