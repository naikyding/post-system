const catchAsync = (func) => async (data) => {
  try {
    await func(data)
  } catch (errors) {
    console.warn('catchAsync Errors:', errors)
  }
}

export default catchAsync
