import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '../views/DashboardPage.vue'
import Login from '../views/Login.vue'
import CataloguePage from '@/views/cataloguePage.vue'
import SellerPage from '@/views/sellerPage.vue'
import ContactPage from '@/views/contactPage.vue'
import AboutPage from '@/views/AboutPage.vue'
import Sell from '@/views/Sell.vue'
import S2S from "@/views/S2S.vue"



const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage
  },
  {
    path: '/dashboard/:category',
    name: 'dashboardCategory',
    component: DashboardPage
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: CataloguePage
  },
  {
    path: '/seller',
    name: 'seller',
    component: SellerPage
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactPage
  },
  {
  path: '/sell',
  name: 'sell',
  component: Sell
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage
  },
  {
  path: "/s2s",
  name: 'S2S',
  component: S2S
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  const publicPages = ['Login']
  const authRequired = !publicPages.includes(to.name)

  if (authRequired && !token) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && token) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router