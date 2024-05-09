import { getProducts } from './products'
import {
  createOrder,
  getOrderList,
  deleteOrder,
  updateOrder,
  deleteOrderItem,
  updateOrderItem,
} from './orders'
import { login, refreshToken, gerUserBaseInfo } from './auth'
import { getDashboardBaseData } from './dashboard'
import { getMarkers, createMarker, deleteMarker, editMarker } from './markers.js'
import { getExtras } from './extras.js'

export const getProductsAPI = getProducts
export const getExtrasAPI = getExtras

export const getOrderListAPI = getOrderList
export const createOrderAPI = createOrder
export const updateOrderAPI = updateOrder
export const updateOrderItemAPI = updateOrderItem
export const deleteOrderAPI = deleteOrder
export const deleteOrderItemAPI = deleteOrderItem

export const loginAPI = login
export const refreshTokenAPI = refreshToken
export const gerUserBaseInfoAPI = gerUserBaseInfo

export const getDashboardBaseDataAPI = getDashboardBaseData

export const getMarkersAPI = getMarkers
export const createMarkerAPI = createMarker
export const deleteMarkerAPI = deleteMarker
export const editMarkerAPI = editMarker
