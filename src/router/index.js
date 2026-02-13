import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../views/DashboardPage.vue'
import productsPage from '@/views/productsPage.vue';

const routes =  [
    {
      path: '/',
      name: 'loginPage',
      component: loginPage

    },
     {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: productsPage
    
  },
  {
    path: '/page2',
    name: 'page2',
    component: Page2
    
  },
  
  ]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
