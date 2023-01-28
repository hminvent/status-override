import storage from 'src/services/storage';

export default [
  {
    path: 'app',
    component: () => import('../layouts/main.vue'),
    children: [
      {
        path: '',
        component: () => import('../pages/app.vue'),
      },
    ],

    beforeEnter: (to, from, next) => {
      const isAuthenticated = storage.getToken() !== null;

      if (!to.path.includes('/auth') && !isAuthenticated) {
        next({ path: '/auth' });
      } else {
        next();
      }
    },
  },
];
