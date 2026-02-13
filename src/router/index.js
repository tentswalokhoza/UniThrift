import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../views/DashboardPage.vue'
import cataloguePage from '@/views/cataloguePage.vue';
import loginTemp from '@/views/loginTemp.vue';

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
    
  }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
