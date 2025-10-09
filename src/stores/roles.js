import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRolesAPI } from '@/api'
import catchAsync from '../utils/catchAsync'

export const useRolesStore = defineStore('Roles', () => {
  const list = ref([])

  const getList = catchAsync(async () => {
    list.value.length = 0
    const { status, data } = await getRolesAPI()
    if (status) {
      list.value = data.items
    }
  })

  return { list, getList }
})
