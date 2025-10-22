import { defineStore } from 'pinia'
import catchAsync from '../utils/catchAsync'
import { getRoutesAPI } from '@/api'
import { ref } from 'vue'

const modules = import.meta.glob('../../src/views/**/*.vue')

export const useRouterStore = defineStore('router-store', () => {
  const generateRoutesStatus = ref(false)
  const routes = ref([])

  function resolveComponent(path) {
    const fullPath = `../views/${path}.vue`
    return modules[fullPath] || (() => import('@/views/NotFound.vue'))
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
    routes.value = data.items
    return transformMenusToRoutes(data.items)
  })

  return {
    transformMenusToRoutes,
    generateRoutes,
    generateRoutesStatus,
    routes,
  }
})
