import request from './request'

export const getMenus = () => request.get('/menus')
export const getMenusAndOperations = () => request.get('/menus?include=operations')
export const createMenu = (data) => request.post('/menus', data)
export const deleteMenu = (id) => request.post(`/menus/${id}`)
export const updateMenu = ({ id, data }) => request.post(`/menus/${id}`, data)
