import axios from 'axios'
import { responseErrorHandler } from '../utils/requestHandler'
import { useAppStore } from '../stores/app'

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
    const accessTokenType = localStorage.getItem('accessTokenType')
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
  function (response) {
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
  function (error) {
    responseErrorHandler(error)
    const appStore = useAppStore()
    appStore.progressStatus = false
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default request
