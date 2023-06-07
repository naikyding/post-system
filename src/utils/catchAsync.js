const catchAsync = (func) => async (data) => {
  try {
    await func(data)
  } catch (errors) {
    console.warn(
      '%c🔥 catchAsync 發生錯誤:',
      'background: #F2B33D; border-radius: 4px; color: #fff; padding: .3rem 1rem;',
      errors,
    )
  }
}

export default catchAsync
