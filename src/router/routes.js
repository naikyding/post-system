const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'post',
        name: 'Order',
        component: () => import('@/views/PostView.vue'),
      },
      {
        path: 'list-status',
        name: 'ListStatus',
        component: () => import('@/views/statusList/index.vue'),
      },
    ],
  },

  {
    path: '/dash',
    component: () => import('@/views/user/Login.vue'),
  },
]

export default routes
