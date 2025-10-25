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
      return next({ path: '/login' })
    }
    return next()
  }

  if (Array.isArray(userStore.baseInfo) && userStore.baseInfo.length < 1)
    userStore.getUserBaseInfo()

  // 已經登入
  if (userStore.isLogin && !routerStore.generateRoutesStatus && to.name !== 'Roles') {
    const routes = await routerStore.generateRoutes()
    routes.forEach((route) => {
      router.addRoute('root', route)
    })
    routerStore.generateRoutesStatus = true
    return next({ ...to, replace: true }) // 確保刷新後能正確匹配
  }

  if (to.name === 'Login') {
    if (!localStorage.getItem('activeRoleId')) return next({ path: '/roles' })
    if (to.query.redirect) {
      return next({ path: to.query.redirect })
    }
    return next({ path: '/' })
  }

  next()
})

router.afterEach(() => {})

export default router
