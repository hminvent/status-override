import appRoutes from 'src/modules/app/router';
import authRoutes from 'src/modules/auth/router';

const routes = [
  {
    path: '/',
    component: () => import('src/layouts/main.vue'),
    children: [
      // default
      {
        path: '',
        redirect: '/app',
      },
      // modules
      ...appRoutes,
      ...authRoutes,
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
