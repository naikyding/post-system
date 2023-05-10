import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/post',
    name: 'post',
    component: () => import('../views/PostView.vue'),
  },
  {
    path: '/list-status',
    name: 'list-status',
    component: () => import('../views/ListStatus.vue'),
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
