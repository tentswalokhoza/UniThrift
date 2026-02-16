import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../views/DashboardPage.vue'
import cataloguePage from '@/views/cataloguePage.vue';
import loginTemp from '@/views/loginTemp.vue';
import sellerPage from '@/views/sellerPage.vue';
import ContactPage from '@/views/contactPage.vue';
import AboutPage from '@/views/AboutPage.vue';

const routes =  [
    {
      path: '/',
      name: 'loginTemp',
      component: loginTemp

    },
     {
    path: '/dashboard',
    name: 'dashboard',
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
     path: '/about',
    name: 'about',
    component: AboutPage
  }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
