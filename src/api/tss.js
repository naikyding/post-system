import request from './request'

export const createTSS = (payload) =>
  request.post('/tts', payload, {
    responseType: 'blob',
  })
