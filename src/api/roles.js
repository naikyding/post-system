import request from './request'

export const getRoles = () => request.get('/roles')
export const createRole = (payload) => request.post('/roles', payload)
export const deleteRole = (id) => request.delete(`/roles/${id}`)
export const updateRole = (id, payload) => request.patch(`/roles/${id}`, payload)
