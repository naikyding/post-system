import request from './request'

export const getMarkers = () => request.get('/markers')
export const createMarker = (data) => request.post('/markers', data)
export const deleteMarker = (id) => request.delete(`/markers/${id}`)
export const editMarker = ({ id, data }) => request.get(`/markers/${id}`, data)
