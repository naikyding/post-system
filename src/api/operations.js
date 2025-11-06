import request from './request'

export const deleteOperation = (id) => request.delete(`/operations/${id}`)
export const createOperation = (payload) => request.post('/operations', payload)
export const updateOperation = (id, payload) => request.patch(`/operations/${id}`, payload)
