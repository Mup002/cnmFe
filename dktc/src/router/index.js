import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/HomeView.vue';
import AdminView from '../views/admin/AdminView.vue';
import SignUpView from '../views/user/SignUpView.vue';
import SignInView from '../views/user/SignInView.vue';
import MovieShowView from '../views/user/MovieShowView.vue';
import DetailMovie from '../views/user/DetailMovie.vue';
import BookingMovie from '../views/user/BookingMovie.vue';
import SiteView from '../views/user/SiteView.vue';
import UserTicketView from '../views/user/UserTicketView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView
    },
    {
      path: '/signup',
      name: 'SignUpView',
      component: SignUpView
    },
    {
      path: '/login',
      name : 'SignInView',
      component: SignInView
    },
    {
      path : '/movies',
      name : 'MovieShowView',
      component : MovieShowView
    },
    {
      path: '/detail/:id',
      name : 'DetailMovie',
      component : DetailMovie
    },
    {
      path: '/admin/home',
      name : 'AdminView',
      component: AdminView
    },
    {
      path: '/booking',
      name: 'BookingMovie',
      component: BookingMovie
    },
    {
      path : '/site/default',
      name : 'SiteView',
      component: SiteView
    },
    {
      path: '/ticket/getAll',
      name : 'UserTicketView',
      component: UserTicketView
    }
  ]
})

export default router
