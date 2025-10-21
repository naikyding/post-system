const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },

  {
    path: '/',
    name: 'root',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/order',

    children: [],
  },
  // 避免 addRoute 重刷頁面，首次失效
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error-page/404.vue'),
  },
]

export default routes
