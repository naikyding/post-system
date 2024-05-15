import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getProductsAPI, getMarkersAPI, createProductAPI, deleteProductAPI } from '@/api'
import catchAsync from '../utils/catchAsync'

export const useProductsStore = defineStore('products', () => {
  // 產品列表
  const products = ref([])

  // 取得產品列表
  const getProducts = catchAsync(async () => {
    const { data } = await getProductsAPI()
    if (data) products.value = data.items
  })

  const createProduct = catchAsync(async (form) => {
    const res = await createProductAPI(form)
    const {
      data: { items },
    } = res
    if (items) products.value = items

    return res
  })

  const deleteProduct = catchAsync(async (id) => {
    const res = await deleteProductAPI(id)
    const {
      data: { items },
    } = res
    if (items) products.value = items

    return res
  })

  return {
    products,
    getProducts,
    createProduct,
    deleteProduct,
  }
})

export const useMarkersStore = defineStore('Markers', () => {
  const markerList = ref([])

  const getMarkers = catchAsync(async () => {
    const { data } = await getMarkersAPI()
    if (data) {
      markerList.value.length = 0
      markerList.value = data.items
    }
  })

  return {
    markerList,

    getMarkers,
  }
})
