import storage from 'src/services/storage';
import profileRoutes from 'src/modules/app/modules/profile/router';

export default [
  {
    path: 'app',
    component: () => import('../layouts/main.vue'),
    children: [
      {
        path: '',
        redirect: '/app/profile',
      },
      // modules
      ...profileRoutes,
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
