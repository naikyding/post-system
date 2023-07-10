import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

import { useUserStore } from '../stores/users'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 如果已經登入，就導首頁
  if (to.name === 'Login' && userStore.isLogin) {
    if (to.query.redirect) {
      return next({ path: to.query.redirect })
    }
    return next({ path: '/' })
  }

  next()
})

export default router
