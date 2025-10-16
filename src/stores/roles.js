import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRolesAPI, getRolesByAgentAPI } from '@/api'
import catchAsync from '../utils/catchAsync'

export const useRolesStore = defineStore('Roles', () => {
  const list = ref([])

  const getList = catchAsync(async (type) => {
    list.value.length = 0
    const { status, data } = type ? await getRolesByAgentAPI() : await getRolesAPI()
    if (status) {
      list.value = data.items
    }
  })

  return { list, getList }
})
