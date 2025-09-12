const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/Login.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/post',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/HomeView.vue'),
      },
      // 點餐頁面
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/order/index.vue'),
      },
      // 訂單狀態
      {
        path: 'order-status',
        name: 'orderStatus',
        component: () => import('@/views/order-status/index.vue'),
      },
      {
        path: 'post',
        name: 'Post',
        component: () => import('@/views/PostView.vue'),
      },
      {
        path: 'list-status',
        name: 'ListStatus',
        component: () => import('@/views/statusList/index.vue'),
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/setting/index.vue'),
      },
    ],
  },

  {
    path: '/dash',
    component: () => import('@/views/user/Login.vue'),
  },
]

export default routes
