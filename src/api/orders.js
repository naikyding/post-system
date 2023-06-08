import request from './request'
import catchAsync from '../utils/catchAsync'

export const createOrder = catchAsync(async (list) => request.post('/orders', list))
