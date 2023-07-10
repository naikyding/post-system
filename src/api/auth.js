import request from './request'

export const login = (emailNPassword) => request.post('/auth/login', emailNPassword)
export const refreshToken = (refreshToken) => request.post('/auth/refresh-token', refreshToken)
export const gerUserBaseInfo = () => request.get('/users/base-info')
