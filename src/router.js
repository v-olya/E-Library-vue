//import { inject } from 'vue';
//import { AuthSymbol } from './helpers/constants.js';
import { createRouter, createWebHistory } from 'vue-router';
import AnonimRoute from './views/AnonimRoute.vue';
import UserRoute from './views/UserRoute.vue';
import PageLayout from './views/PageLayout.vue';
import NotFound from './views/NotFound.vue';

const routes = [
  {
    path: '/login',
    component: AnonimRoute,
    children: [
      {
        path: '',
        component: PageLayout,
        props: { type: 'Login' },
      },
    ],
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: UserRoute,
    children: [
      {
        path: '',
        component: PageLayout,
        props: { type: 'Home' },
      },
    ],
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;
