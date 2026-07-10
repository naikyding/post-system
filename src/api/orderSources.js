import request from './request'
const BASE_URL = '/order-sources'

export const getOrderSources = () => request.get(`${BASE_URL}`)
export const createOrderSource = (data) => request.post(`${BASE_URL}`, data)
export const deleteOrderSource = (id) => request.delete(`${BASE_URL}/${id}`)
export const editOrderSource = ({ id, data }) => request.patch(`${BASE_URL}/${id}`, data)
