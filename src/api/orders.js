import request from './request'
import catchAsync from '../utils/catchAsync'

export const postOrderList = catchAsync(async (list) => request.post('/orders', list))
