import axios from 'axios'
import { useAppStore } from '../stores/app'
import { useUserStore } from '../stores/users.js'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

let requestTokenQueue = []

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

    // statusCode 401
    if (error.response.status === 401) {
      // 如果請求 refreshToken 且 未經授權，則不再請求
      if (
        originalRequest.url === '/auth/refresh-token' &&
        error.response.data.message === 'Unauthorized'
      )
        return false

      const userStore = useUserStore()

      // 只有一個被刷新
      if (requestTokenQueue.length === 0) {
        requestTokenQueue.push('refreshToken')
        requestTokenQueue.push(originalRequest)

        // 刷新 token
        await userStore.refreshToken({
          refreshToken: userStore.token.refreshToken,
        })

        // 設置 header authorization
        const { type, accessToken } = await userStore.checkLocalTokenAndReturnAccessToken()
        if (accessToken && type) {
          error.config.headers.Authorization = `${type} ${accessToken}`
          // 移除 refreshRequest
          requestTokenQueue.shift()

          // 重新請求失敗的 request

          await requestTokenQueue.forEach((originalRequestItem) => request(originalRequestItem))
          return (requestTokenQueue.length = 0)
          // return request(originalRequest)
        }
      } else {
        requestTokenQueue.push(originalRequest)
      }

      // 401 end
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default request
