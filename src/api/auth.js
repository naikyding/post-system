import request from './request'

export const login = (emailNPassword) => request.post('/auth/login', emailNPassword)
