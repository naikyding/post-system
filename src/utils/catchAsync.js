const catchAsync = (func) => async (data) => {
  try {
    await func(data)
  } catch (errors) {
    if (errors.name === 'AxiosError') {
      return console.warn(
        '%c🔥 API 發生錯誤:',
        'background: #F2B33D; border-radius: 4px; color: #fff; padding: .3rem 1rem;',
        `${errors.config.baseURL}/${errors.config.url}`,
        errors,
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
