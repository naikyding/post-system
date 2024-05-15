import request from './request'

export const getExtras = () => request.get('extras')
export const createExtras = (data) => request.post('extras', data)
