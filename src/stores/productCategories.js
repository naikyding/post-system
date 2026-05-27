import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getProductCategoriesAPI,
  createProductCategoryAPI,
  deleteProductCategoryAPI,
  updateProductCategoryAPI,
} from '@/api'
import catchAsync from '../utils/catchAsync'

export const useProductsCategoryStore = defineStore('ProductCategories', () => {
  // 產品列表
  const list = ref([])

  const getProductCategories = catchAsync(async () => {
    const { data } = await getProductCategoriesAPI()

    list.value = data?.items || []
  })

  const createProductCategory = catchAsync(async (form) => {
    const { data } = await createProductCategoryAPI(form)

    list.value = data?.items || []
    return data
  })

  const updateProductCategory = catchAsync(async (id, updateData) => {
    const res = await updateProductCategoryAPI(id, updateData)

    list.value = res.data?.items || []
    return res
  })

  const deleteProductCategory = catchAsync(async (id) => {
    const res = await deleteProductCategoryAPI(id)
    const { data } = res
    list.value = data?.items || []

    return res
  })

  return {
    list,
    getProductCategories,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
  }
})
