import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';
import Login from '../pages/Login.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../pages/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
