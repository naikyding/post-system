import Swal from 'sweetalert2'

const defaultSuccessFunc = (message) => {
  Swal.fire({
    icon: 'success',
    title: message || 'Success',
    width: '300px',
    timer: 1500,
    showConfirmButton: false,
  })
}

const defaultErrorFunc = (message) => {
  Swal.fire({
    icon: 'error',
    title: message || 'Error',
    width: '300px',
    timer: 1500,
    showConfirmButton: false,
  })
}

export const resFunc = (status, successFunc = defaultSuccessFunc, errorFunc = defaultErrorFunc) => {
  if (status) return successFunc()
  return errorFunc()
}

export const successErrorFunc = ({
  status,
  message,
  successCallback,
  errorCallback = defaultErrorFunc,
}) => {
  if (status) {
    defaultSuccessFunc(message)
    if (successCallback) successCallback(message)
    return false
  }
  if (errorCallback) return errorCallback(message)
}
