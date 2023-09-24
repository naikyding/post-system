import request from './request'

export const getDashboardBaseData = (queryString) => request.get(`/dashboard/base${queryString}`)
