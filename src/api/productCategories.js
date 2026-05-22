import request from './request'

export const getProductCategories = () => request.get('/product-categories')
export const createProductCategory = (data) => request.post('/product-categories', data)
export const deleteProductCategory = (id) => request.delete(`/product-categories/${id}`)
export const updateProductCategory = (id, updateData) =>
  request.patch(`/product-categories/${id}`, updateData)
