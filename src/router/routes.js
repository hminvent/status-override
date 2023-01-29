import appRoutes from 'src/modules/app/router';
import authRoutes from 'src/modules/auth/router';
import { DEFAULT_ROUTE } from 'src/configs/router';

const routes = [
  {
    path: '/',
    component: () => import('src/layouts/main.vue'),
    children: [
      // default
      {
        path: '',
        redirect: DEFAULT_ROUTE,
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
