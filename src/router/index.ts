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
          path: '/manage',
          name: 'manage',
          component: () => import('@/pages/manage/index.vue'),
          children: [
            {
              path: '',
              name: 'manageDashboard',
              meta: {
                title: '人人低码 | 仪表盘'
              },
              component: () => import('@/pages/manage/_pages/dashboard/ManagementDashboard.vue')
            },
            {
              path: '/manage/material',
              name: 'manageMaterial',
              meta: {
                title: '人人低码 | 物料管理'
              },
              component: () => import('@/pages/manage/_pages/material/ManagementMaterial.vue')
            },
            {
              path: '/manage/project',
              name: 'manageProject',
              meta: {
                title: '人人低码 | 项目管理'
              },
              component: () => import('@/pages/manage/_pages/project/ManagementProject.vue')
            },
            {
              path: '/manage/userInfo',
              name: 'manageUserInfo',
              meta: {
                title: '人人低码 | 用户中心'
              },
              component: () => import('@/pages/manage/_pages/userInfo/ManagementUserInfo.vue')
            }
          ]
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
