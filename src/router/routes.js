import { components } from 'vuetify/dist/vuetify-labs.js'

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
