import { validateToken } from 'src/boot/socket';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: async (to, from, next) => {
      if (await validateToken()) {
        next();
      } else {
        next('/login');
      }
    },
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/login/IndexPage.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
