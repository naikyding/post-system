import request from './request'

export const postOrderList = (list) => request.post('/orders', list)
