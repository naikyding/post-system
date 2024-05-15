import request from './request'

export const getProducts = () => request.get('products')
export const createProduct = (data) => request.post('products', data)
export const deleteProduct = (id) => request.delete(`products/${id}`)
