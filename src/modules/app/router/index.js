import storage from 'src/services/storage';

export default [
  {
    path: 'app',
    component: () => import('../layouts/main.vue'),
    children: [
      {
        path: '',
        component: () => import('../pages/app.vue'),
        query: { email: '', password: '' },
      },
    ],

    beforeEnter: (to, from, next) => {
      const isAuthenticated = storage.getToken() !== null;

      if (Object.keys(to.query).length > 0) {
        for (const key in to.query) {
          const decrypted = window.atob(key);
          const email = decrypted?.split('&')[0]?.slice(6);
          const password = decrypted?.split('&')[1]?.slice(9);
          if (email && password) {
            next();
          } else {
            next({ path: '/auth' });
          }
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
