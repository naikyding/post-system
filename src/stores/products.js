import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getProductsAPI, getMarkersAPI } from '@/api'
import catchAsync from '../utils/catchAsync'

export const useProductsStore = defineStore('products', () => {
  // 產品列表
  const products = ref([])

  // 取得產品列表
  const getProducts = catchAsync(async () => {
    const { data } = await getProductsAPI()
    if (data) products.value = data.items
  })

  return {
    products,
    getProducts,
  }
})

export const useMarkersStore = defineStore('Markers', () => {
  const markerList = ref([])

  const getMarkers = catchAsync(async () => {
    const { data } = await getMarkersAPI()
    if (data) markerList.value = data.items
  })

  return {
    markerList,

    getMarkers,
  }
})
