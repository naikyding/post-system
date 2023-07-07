export const responseErrorHandler = (error) => {
  const { status } = error.response
  switch (status) {
    // 身份驗證失效
    case 401:
      console.log(401)
      break

    default:
      break
  }
}
