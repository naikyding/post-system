import request from './request'
const BASE_URL = '/payment-types'

export const getPaymentTypes = () => request.get(`${BASE_URL}`)
export const createPaymentType = (data) => request.post(`${BASE_URL}`, data)
export const deletePaymentType = (id) => request.delete(`${BASE_URL}/${id}`)
export const editPaymentType = ({ id, data }) => request.patch(`${BASE_URL}/${id}`, data)
