import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import CalloutConnect from '../views/CalloutConnect.vue';
import CalloutLocate from '../views/CalloutLocate.vue';
import MapMenu from '../views/MapMenu.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/connect/:mapSlug',
    name: 'CalloutConnect',
    component: CalloutConnect,
    props: true,
  },
  {
    path: '/locate/:mapSlug',
    name: 'CalloutLocate',
    component: CalloutLocate,
    props: true,
  },
  {
    path: '/locate',
    name: 'LocateMenu',
    component: MapMenu,
    props: {
      gameMode: 'locate',
    },
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
