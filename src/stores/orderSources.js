import catchAsync from '../utils/catchAsync'

import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  getOrderSourcesAPI,
  createOrderSourceAPI,
  deleteOrderSourceAPI,
  editOrderSourceAPI,
} from '@/api'

export const useOrderSourcesStore = defineStore('OrderSources', () => {
  const orderSourceList = ref([])

  const getOrderSources = catchAsync(async () => {
    const { data } = await getOrderSourcesAPI()
    if (data) {
      saveOrderSourceList(data)
    }
  })

  function saveOrderSourceList(data) {
    orderSourceList.value.length = 0
    orderSourceList.value = data.items
  }

  return {
    orderSourceList,

    getOrderSources,
    saveOrderSourceList,
  }
})
