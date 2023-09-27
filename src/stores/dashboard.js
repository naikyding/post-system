import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { getDashboardBaseDataAPI } from '@/api'
import { dateFormat } from '../utils/day'
import dayjs from 'dayjs'

export const useDashboardStore = defineStore('Dashboard', () => {
  const searchData = reactive({
    isPaid: 'true',
    payType: 'all',
    from: dateFormat(dayjs()),
    to: dateFormat(dayjs()),
  })

  const dashboardData = reactive({
    total: {
      completed: [],
      pending: [],
      cancelled: [],
    },
  })

  const formatSearchQueryString = computed(() => {
    let searchString = '?'

    Object.keys(searchData).forEach((key) => {
      if (searchData[key]) {
        searchString === '?'
          ? (searchString += `${key}=${searchData[key]}`)
          : (searchString += `&${key}=${searchData[key]}`)
      }
    })
    return searchString
  })

  async function getDashboardData(searchString) {
    const res = await getDashboardBaseDataAPI(searchString)
    dashboardData.total = {
      completed: [],
      pending: [],
      cancelled: [],
    }
    dashboardData.total = { ...res.data.total }
  }

  return {
    searchData,
    formatSearchQueryString,
    dashboardData,

    getDashboardData,
  }
})
