import Swal from 'sweetalert2'
import { useErrorStore } from '../stores/errorStore'

// 錯誤預設處理
export const errorFunction = (errors, message) => {
  console.log(errors.response)
  let formatText = null

  // 直接操作
  if (errors === null) {
    Swal.fire({
      icon: 'error',
      title: message || '🔥 請求失敗',
      width: '400px',
      timer: 2000,
      showConfirmButton: false,
    })
  }

  // // 若後端有響應
  if (errors.response) {
    // format html 顯示字串
    if (errors.response.data.errors) {
      formatText = errors.response.data.errors.reduce((init, cur, curIndex) => {
        const str = `<li>❌ ${cur}</li>`
        if (errors.response.data.errors.length === curIndex - 1) return (init += `${str}</ul>`)
        return (init += str)
      }, '<ul>')
    }

    // 前端 log
    Swal.fire({
      icon: 'error',
      title: message || errors.response.data.message || '🔥 請求失敗',
      html: formatText,
      width: '400px',
      timer: 2500,
      showConfirmButton: false,
    })

    // log
    return console.warn(
      `%c🔥 ${errors.response.status} 請求失敗:`,
      'background: #F2B33D; border-radius: 4px; color: #fff; padding: .3rem 1rem;',
      `${errors.config.baseURL}/${errors.config.url}`,
      errors.response.data.errors,
    )
  }
  // 網路失敗
  if (errors.message === 'Network Error') {
    Swal.fire({
      icon: 'error',
      title: '🔥 網路連線失敗:',
      text: errors.message,
      width: '400px',
      timer: 1500,
      showConfirmButton: false,
    })

    return console.warn(
      '%c🔥 網路連線失敗:',
      'background: #F2B33D; border-radius: 4px; color: #fff; padding: .3rem 1rem;',
      `${errors.config.baseURL}/${errors.config.url}`,
      errors.message,
    )
  }

  console.warn(
    '%c🔥 catchAsync 發生錯誤:',
    'background: #F2B33D; border-radius: 4px; color: #fff; padding: .3rem 1rem;',
    errors || '',
  )
}

const catchAsync =
  (func, errorFunc) =>
  async (...args) => {
    try {
      // 成功處理
      return await func(...args)
    } catch (errors) {
      // const errorStore = useErrorStore()
      // 錯誤處理: 組件內的錯誤處理
      // errorStore.errorActions[errors.status].push(() => func(...args))

      // errorStore.errorActions[errors.response.status].push(() => func(...args))
      // console.log(errorStore.errorActions)

      if (errorFunc) return errorFunc(errors)
      return errorFunction(errors)
    }
  }

export default catchAsync
