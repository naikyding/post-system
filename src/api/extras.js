import request from './request'

export const getExtras = () => request.get('extras')
export const createExtras = (data) => request.post('extras', data)
export const deleteExtra = (id) => request.delete(`extras/${id}`)
export const updateExtra = (id, updateData) => request.patch(`extras/${id}`, updateData)
