import CryptoJS from 'crypto-js'

// 加密
export const encrypt = (data = '', secretKey = import.meta.env.VITE_SECRET_CODE) =>
  CryptoJS.AES.encrypt(data, secretKey).toString()

// 解密
export const decrypt = (secretData = '', secretKey = import.meta.env.VITE_SECRET_CODE) =>
  CryptoJS.AES.decrypt(secretData, secretKey).toString(CryptoJS.enc.Utf8)
