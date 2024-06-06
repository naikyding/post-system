import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getExtrasAPI, createExtrasAPI, deleteExtraAPI, updateExtraAPI } from '@/api'
import catchAsync from '../utils/catchAsync'

export const useExtrasStore = defineStore('extras', () => {
  const extras = ref([])

  const getExtrasList = catchAsync(async () => {
    const { data } = await getExtrasAPI()
    if (data) saveExtrasList(data)
  })

  function saveExtrasList(data) {
    extras.value.length = 0
    extras.value = data.items
  }

  const createExtrasItem = catchAsync(async (form) => {
    const cloneForm = JSON.parse(JSON.stringify(form))
    delete cloneForm.extras

    const res = await createExtrasAPI(cloneForm)
    const { status, data } = res
    if (status) saveExtrasList(data)

    return res
  })

  const deleteExtra = catchAsync(async (id) => {
    const res = await deleteExtraAPI(id)
    const { status, data } = res
    if (status) saveExtrasList(data)

    return res
  })

  const updateExtra = catchAsync(async (id, updateData) => {
    const res = await updateExtraAPI(id, updateData)
    const { status, data } = res
    if (status) saveExtrasList(data)

    return res
  })

  return {
    extras,
    getExtrasList,
    createExtrasItem,
    deleteExtra,
    updateExtra,
  }
})
