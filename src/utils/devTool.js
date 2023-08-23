export const isDev = () => {
  const urlString = location.href
  const localDevAry = ['localhost']

  return localDevAry.find((item) => urlString.includes(item))
}
