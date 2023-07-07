import { useUerStore } from '../stores/users.js'

export const responseErrorHandler = (error) => {
  const { status } = error.response
  const userStore = useUerStore()

  switch (status) {
    // 身份驗證失效
    case 401:
      userStore.refreshToken({ refreshToken: userStore.token.refreshToken })
      break

    default:
      break
  }
}
