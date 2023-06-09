import request from './request'

export const createOrder = (list) => request.post('/orders', list)
