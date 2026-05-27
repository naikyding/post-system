import request from './request'

export const getExtraCategories = () => request.get('/extra-categories')
export const createExtraCategory = (data) => request.post('/extra-categories', data)
export const deleteExtraCategory = (id) => request.delete(`/extra-categories/${id}`)
export const updateExtraCategory = (id, updateData) =>
  request.patch(`/extra-categories/${id}`, updateData)
