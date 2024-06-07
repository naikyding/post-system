import { getProducts, createProduct, deleteProduct, updateProduct } from './products'
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
import { getExtras, createExtras, deleteExtra, updateExtra } from './extras.js'

export const getProductsAPI = getProducts
export const createProductAPI = createProduct
export const deleteProductAPI = deleteProduct
export const updateProductAPI = updateProduct

export const getExtrasAPI = getExtras
export const createExtrasAPI = createExtras
export const deleteExtraAPI = deleteExtra
export const updateExtraAPI = updateExtra

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
