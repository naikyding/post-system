import HomeView from '../views/HomeView.vue'
import PostView from '../views/PostView.vue'
import ListStatus from '../views/statusList/index.vue'
import Login from '../views/user/Login.vue'

import Layout from '../views/layout/index.vue'

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: HomeView,
      },
      {
        path: 'post',
        name: 'post',
        component: PostView,
      },
      {
        path: 'list-status',
        name: 'list-status',
        component: ListStatus,
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
