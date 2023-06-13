import { getProducts } from './products'
import { createOrder, getOrderList, deleteOrder, deleteOrderItem } from './orders'

export const getProductsAPI = getProducts

export const getOrderListAPI = getOrderList
export const createOrderAPI = createOrder
export const deleteOrderAPI = deleteOrder
export const deleteOrderItemAPI = deleteOrderItem
