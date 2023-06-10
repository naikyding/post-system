import request from './request'

export const getOrderList = () => request.get('/orders')
export const createOrder = (list) => request.post('/orders', list)
