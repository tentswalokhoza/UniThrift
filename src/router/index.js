import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../views/DashboardPage.vue'
import Login from '../views/Login.vue'
import productsPage from '@/views/productsPage.vue';


const routes =  [
    {
      path: '/',
      name: 'Login',
      component: Login

    },
  //    {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: DashboardPage
  // },
  // {
  //   path: '/catalogue',
  //   name: 'catalogue',
  //   component: productsPage
    
  // }
  
  ]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
