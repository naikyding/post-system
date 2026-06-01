import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getExtraCategoriesAPI,
  createExtraCategoryAPI,
  deleteExtraCategoryAPI,
  updateExtraCategoryAPI,
} from '@/api'
import catchAsync from '../utils/catchAsync'

export const useExtrasCategoryStore = defineStore('ExtraCategories', () => {
  // 產品列表
  const list = ref([])

  const getExtraCategories = catchAsync(async () => {
    const { data } = await getExtraCategoriesAPI()

    list.value = data?.items || []
  })

  const createExtraCategory = catchAsync(async (form) => {
    const { data } = await createExtraCategoryAPI(form)

    list.value = data?.items || []
    return data
  })

  const updateExtraCategory = catchAsync(async (id, updateData) => {
    const res = await updateExtraCategoryAPI(id, updateData)

    list.value = res.data?.items || []
    return res
  })

  const deleteExtraCategory = catchAsync(async (id) => {
    const res = await deleteExtraCategoryAPI(id)
    const { data } = res
    list.value = data?.items || []

    return data
  })

  return {
    list,
    getExtraCategories,
    createExtraCategory,
    updateExtraCategory,
    deleteExtraCategory,
  }
})
