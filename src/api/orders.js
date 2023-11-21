import request from './request'

export const getOrderList = (urlQueryString) => request.get(`/orders${urlQueryString}`)

export const createOrder = (list) => request.post('/orders', list)

export const updateOrder = (id, updateData) => request.patch(`/orders/${id}`, updateData)
export const updateOrderItem = ({ orderId, itemId, extras }) =>
  request.patch(`/orders/${orderId}/item/${itemId}`, { extras })

export const deleteOrder = (id) => request.delete(`/orders/${id}`)
export const deleteOrderItem = (id) => request.delete(`/orders/item/${id}`)
