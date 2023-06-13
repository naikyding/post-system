import request from './request'

export const getOrderList = () => request.get('/orders')
export const createOrder = (list) => request.post('/orders', list)
export const deleteOrder = (id) => request.delete(`/orders/${id}`)
export const deleteOrderItem = (id) => request.delete(`/orders/item/${id}`)
