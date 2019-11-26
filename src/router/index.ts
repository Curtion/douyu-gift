import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/home.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/config',
    name: 'config',
    component: () => import('../views/config.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/about.vue')
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

export default router;
