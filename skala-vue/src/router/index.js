import { createRouter, createWebHistory } from 'vue-router'
import PracticesView from '../views/PracticesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PracticesView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/weather',
      name: 'weather-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/weather/about',
      name: 'weather-about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/weather/explore',
      name: 'weather-explore',
      component: () => import('../views/WeatherExploreView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
