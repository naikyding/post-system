const defaultSuccessFunc = () => {
  console.log('res success')
}

const defaultErrorFunc = () => {
  console.log('res error')
}

export const resFunc = (status, successFunc = defaultSuccessFunc, errorFunc = defaultErrorFunc) => {
  if (status) return successFunc()
  return errorFunc()
}
