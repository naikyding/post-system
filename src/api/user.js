import request from './request'

export const getUsers = () => request.get('/users')
export const createUser = (payload) => request.post('/users', payload)
export const deleteUser = (id) => request.delete(`/users/${id}`)
export const updateUser = (id, payload) => request.patch(`/users/${id}`, payload)
export const updateUserPassword = (id, payload) => request.patch(`/users/${id}/password`, payload)
