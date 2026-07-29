import catchAsync from '../utils/catchAsync'

import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  getPaymentTypesAPI,
  createPaymentTypeAPI,
  deletePaymentTypeAPI,
  editPaymentTypeAPI,
} from '@/api'

export const usePaymentTypesStore = defineStore('PaymentTypes', () => {
  const list = ref([])

  const getPaymentTypes = catchAsync(async () => {
    const { data } = await getPaymentTypesAPI()
    if (data) {
      savePaymentTypeList(data)
    }
  })

  function savePaymentTypeList(data) {
    list.value.length = 0
    list.value = data.items
  }

  return {
    list,

    getPaymentTypes,
    savePaymentTypeList,
  }
})
