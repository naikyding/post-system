import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptors ((REQUEST))
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent

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

    const successStatus = [200, 201]
    if (successStatus.includes(response.status)) {
      console.log(
        `%c✅ ${response.status} Response: `,
        'background: #04BFBF; border-radius: 4px; padding: .3rem 1rem;',
        response.data,
      )
      return response.data
    }

    console.log(
      `%c❌ ${response.status} Response: `,
      'background: #F21313; border-radius: 4px; padding: .3rem 1rem;',
      response.data,
    )
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default request
