/**
 * @description plugin-code-generator comstants
 * @author FluffyChi-Xing
 */


/**
 * @description 基础路由配置
 * @param routes
 * @constructor
 */
export const ROUTER_CONTEXT = (routes?: WorkerSpaceInterface.IRoute[]): string => `
import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from "nprogress"
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ${routes?.map(route => `
      {
        component: () => import('../pages/${route.name}'),
        meta: { title: '${route.meta ? route.meta.title : ''}' },
        name: '${route.name}',
        path: '${route.path}'
      },
    `).join(',')}
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
`

