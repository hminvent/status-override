import storage from 'src/services/storage';

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
        next({ path: '/app' });
      } else {
        next();
      }
    },
  },
];
