import { defineStore } from 'pinia'
import { ref } from 'vue'
import catchAsync from '../utils/catchAsync'
import { getMenusAndOperationsAPI } from '@/api'

export const useMenusStore = defineStore('Menus', () => {
  const menus = ref([])

  const getMenus = catchAsync(async () => {})

  const getMenusAndOperations = catchAsync(async () => {
    menus.value.length = 0
    const { data } = await getMenusAndOperationsAPI()
    if (data) menus.value = data.items
  })

  const createMenu = catchAsync(async () => {})

  const updateMenu = catchAsync(async () => {})

  const deleteMenu = catchAsync(async () => {})

  return {
    menus,
    getMenusAndOperations,
    getMenus,
    createMenu,
    updateMenu,
    deleteMenu,
  }
})
