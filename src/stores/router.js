import { defineStore } from 'pinia'
import catchAsync from '../utils/catchAsync'
import { getRoutesAPI } from '@/api'
import { nextTick, ref } from 'vue'

const modules = import.meta.glob('../../src/views/**/*.vue')

export const useRouterStore = defineStore('router-store', () => {
  const generateRoutesStatus = ref(false)
  const routes = ref([])

  function resolveComponent(path) {
    const fullPath = `../views/${path}.vue`
    return modules[fullPath] || (() => import('@/views/error-page/404.vue'))
  }

  function transformMenusToRoutes(menus) {
    return menus
      .filter((menu) => menu.status)
      .sort((a, b) => a.sort - b.sort)
      .map((menu) => {
        const route = {
          redirect: menu.redirect,
          path: menu.path,
          name: menu.name,
          component: resolveComponent(menu.component),
          meta: {
            title: menu.name,
            icon: menu.icon,
          },
        }

        if (menu.children?.length) {
          route.children = transformMenusToRoutes(menu.children)
        }

        return route
      })
  }

  const generateRoutes = catchAsync(async () => {
    const { data } = await getRoutesAPI()
    routes.value.length = 0
    nextTick(() => {
      routes.value = data.items
    })

    return transformMenusToRoutes(data.items)
  })

  return {
    transformMenusToRoutes,
    generateRoutes,
    generateRoutesStatus,
    routes,
  }
})
