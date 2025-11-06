import request from './request'

export const getMenus = () => request.get('/menus')
export const getMenusAndOperations = () => request.get('/menus?include=operations')
export const createMenu = (payload) => request.post('/menus', payload)
export const deleteMenu = (id) => request.delete(`/menus/${id}`)
export const updateMenu = (id, payload) => request.patch(`/menus/${id}`, payload)
export const getRoutes = () => request.get('/routes')
