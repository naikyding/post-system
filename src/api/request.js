import axios from 'axios'
import { statusCodeHandler } from '../utils/requestHandler'
import { useAppStore } from '../stores/app'
import { useUerStore } from '../stores/users.js'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptors ((REQUEST))
request.interceptors.request.use(
  function (config) {
    // loading display
    const appStore = useAppStore()
    appStore.progressStatus = true

    // 設置 header authorization
    const accessToken = localStorage.getItem('accessToken')
    const accessTokenType = localStorage.getItem('type')
    if (accessToken && accessTokenType) {
      config.headers.Authorization = `${accessTokenType} ${accessToken}`
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
      if (originalRequest.url === '/auth/refresh-token') return false

      const userStore = useUerStore()
      console.log('refreshToken')
      // 刷新 token
      await userStore.refreshToken({
        refreshToken: userStore.token.refreshToken,
      })

      // 設置 header authorization
      const accessToken = localStorage.getItem('accessToken')
      const accessTokenType = localStorage.getItem('type')
      if (accessToken && accessTokenType) {
        error.config.headers.Authorization = `${accessTokenType} ${accessToken}`

        // 重新請求失敗的 request
        return request(originalRequest)
      }
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default request
