import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import request from '../api/request'

import { useUserStore } from '../stores/users'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 沒有登入 && 不在登入頁
  if (to.name !== 'Login' && !userStore.isLogin) return next({ path: '/login' })

  // 已經登入 && 進入登入頁面
  if (to.name === 'Login' && userStore.isLogin) {
    if (to.query.redirect) {
      return next({ path: to.query.redirect })
    }
    return next({ path: '/' })
  }

  next()
})

export default router
