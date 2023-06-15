import HomeView from '../views/HomeView.vue'
import PostView from '../views/PostView.vue'
import ListStatus from '../views/statusList/index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/post',
    name: 'post',
    component: PostView,
  },
  {
    path: '/list-status',
    name: 'list-status',
    component: ListStatus,
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
