import Swal from 'sweetalert2'

const catchAsync = (func) => async (data) => {
  try {
    return await func(data)
  } catch (errors) {
    // 若後端有響應
    if (errors.response) {
      // format html 顯示字串
      const formatText = errors.response.data.errors.reduce((init, cur, curIndex) => {
        const str = `<li>❌ ${cur}</li>`
        if (errors.response.data.errors.length === curIndex - 1) return (init += `${str}</ul>`)
        return (init += str)
      }, '<ul>')

      // 前端 log
      Swal.fire({
        icon: 'error',
        title: '🔥 請求失敗',
        html: formatText,
        width: '400px',
      })

      // log
      return console.warn(
        '%c🔥 請求失敗:',
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
      errors,
    )
  }
}

export default catchAsync
