import Login from '../views/user/Login.vue'
import Layout from '../views/layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
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
    component: Layout,
  },

  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
  },
]

export default routes
