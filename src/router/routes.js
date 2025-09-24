const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },

  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/order',
    children: [
      // 儀表板
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '儀表板' },
      },
      // 點餐頁面
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/order/index.vue'),
        meta: { title: '點餐' },
      },
      // 訂單狀態
      {
        path: 'order-status',
        name: 'orderStatus',
        component: () => import('@/views/order-status/index.vue'),
        meta: { title: '訂單狀態' },
      },
      // 設定
      {
        path: 'setting',
        name: 'setting',
        children: [
          {
            path: 'menus',
            name: 'settingMenus',
            component: () => import('@/views/setting/menus.vue'),
            meta: { title: '選單設定' },
          },
          {
            path: 'products',
            name: 'settingProducts',
            component: () => import('@/views/setting/products.vue'),
            meta: { title: '產品設定' },
          },
        ],
      },
    ],
  },
]

export default routes
