import storage from 'src/services/storage';
import { DEFAULT_ROUTE } from 'src/configs/router';

export default [
  {
    path: 'auth',
    component: () => import('../layouts/main.vue'),
    children: [
      // Default
      {
        path: '',
        redirect: '/auth/login',
      },
      {
        path: 'login',
        component: () => import('../pages/login.vue'),
      },
    ],

    beforeEnter: (to, from, next) => {
      const isAuthenticated = storage.getToken() !== null;

      if (to.path.includes('/auth') && isAuthenticated) {
        next({ path: DEFAULT_ROUTE });
      } else {
        next();
      }
    },
  },
];
