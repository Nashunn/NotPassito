import Vue from 'vue'
import Router from 'vue-router'
import BaseLayout from '@/layout/BaseLayout'
Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'tables',
      component: BaseLayout,
      children: [
        {
          path: '/tables',
          name: 'tables',
          component: () => import('./views/Tables.vue')
        }
      ]
    }
  ]
})
