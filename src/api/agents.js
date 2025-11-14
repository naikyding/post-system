import request from './request'

export const getAgents = () => request.get('/agents')
export const createAgent = (payload) => request.post('/agents', payload)
export const deleteAgent = (id) => request.delete(`/agents/${id}`)
export const updateAgent = (id, payload) => request.patch(`/agents/${id}`, payload)
