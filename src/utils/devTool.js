export const isDev = () => {
  console.log(location.href)
  const urlString = location.href
  const localDevAry = ['localhost']

  return localDevAry.find((item) => urlString.includes(item))
}
