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
]

export default routes
