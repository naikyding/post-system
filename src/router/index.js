import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useRouterStore } from '@/stores/router'
import { useUserStore } from '@/stores/users'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const routerStore = useRouterStore()

  // 尚未登入
  if (!userStore.isLogin) {
    if (to.name !== 'Login') {
      return next({ name: 'Login' })
    }
    return next()
  }

  // 已經登入
  if (!userStore.baseInfo?._id && userStore.baseInfo?.agentRoles.length < 1)
    userStore.getUserBaseInfo()

  if (to.name === 'Login') {
    if (localStorage.getItem('activeRoleId') === null) return next({ name: 'RolesMain' })
    if (to.query.redirect) {
      return next({ path: to.query.redirect })
    }
    return next({ path: '/' })
  }

  if (localStorage.getItem('activeAgentId') === null) {
    if (to.name !== 'RolesMain') {
      return next({ name: 'RolesMain' })
    } else return next()
  }

  if (userStore.isLogin && !routerStore.generateRoutesStatus) {
    const routes = await routerStore.generateRoutes()
    console.log(router.getRoutes())
    routes.forEach((route) => {
      if (!router.hasRoute(route.name)) {
        console.log(route.name, '這是不存在的路由，現在加入')
        router.addRoute('root', route)
      }
    })
    routerStore.generateRoutesStatus = true
    return next(to.fullPath)
  }
  next()
})

router.afterEach(() => {})

export default router
