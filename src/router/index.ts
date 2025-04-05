import {createRouter, createWebHashHistory} from 'vue-router';
import NProgress from "nprogress";
import 'nprogress/nprogress.css';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/pages/index.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {
            title: '人人低码 | 首页'
          },
          component: () => import('@/pages/home/index.vue'),
        },
        {
          path: '/workerSpace',
          name: 'workerSpace',
          meta: {
            title: '人人低码 | 工作空间'
          },
          component: () => import('@/pages/workerspace/index.vue')
        }
      ]
    },
  ]
})


router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }
  if (to.path === '/') {
    next('/home');
  }
  next();
});



router.afterEach(() => {
  NProgress.done();
});

export default router
