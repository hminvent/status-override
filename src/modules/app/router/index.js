import storage from 'src/services/storage';

export default [
  {
    path: 'app',
    component: () => import('../layouts/main.vue'),
    children: [
      {
        path: '',
        component: () => import('../pages/app.vue'),
        query: {
          code: '',
          state: '',
        },
      },
    ],

    beforeEnter: (to, from, next) => {
      const isAuthenticated = storage.getToken() !== null;

      const { code, state } = to.query;

      if (Object.keys(to.query).length > 0) {
        if (code && state) {
          next();
        } else {
          next({ path: '/auth' });
        }
      } else {
        if (!to.path.includes('/auth') && !isAuthenticated) {
          next({ path: '/auth' });
        } else {
          next();
        }
      }
    },
  },
];
