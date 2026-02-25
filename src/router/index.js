import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from '../views/DashboardPage.vue';
import Login from '../views/Login.vue';
import cataloguePage from '@/views/cataloguePage.vue';
import sellerPage from '@/views/sellerPage.vue';
import ContactPage from '@/views/contactPage.vue';
import AboutPage from '@/views/AboutPage.vue';
import CartPage from '@/views/CartPage.vue';
import CheckoutPage from '@/views/CheckoutPage.vue';
import PaymentPage from '@/views/PaymentPage.vue';
import ConfirmationPage from '@/views/ConfirmationPage.vue';

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
    component: cataloguePage
  },
  {
    path: '/seller',
    name: 'seller',
    component: sellerPage
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactPage
  },
  {
    path:'/review',
    name: 'review',
    component: ReviewsPage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage
  },
  {
    path: '/payment',
    name: 'payment',
    component: PaymentPage
  },
  {
    path: '/confirmation',
    name: 'confirmation',
    component: ConfirmationPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
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
