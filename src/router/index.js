import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/load'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/401', component: () => import('@/views/401'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  { path: '*', redirect: '/', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/role',
    component: Layout,
    meta: { roles: ['RR_ROLE_MANAGE'] },
    children: [
      {
        path: 'index',
        name: '角色管理',
        component: () => import('@/views/role/list'),
        meta: { title: '角色管理', icon: 'form', roles: ['RR_ROLE_MANAGE'] }
      }
    ]
  },
  {
    path: '/question',
    component: Layout,
    meta: { roles: ['RR_QUESTION_MANAGE'] },
    children: [
      {
        path: 'index',
        name: '问答管理',
        component: () => import('@/views/question/list'),
        meta: { title: '问答管理', icon: 'form', roles: ['RR_QUESTION_MANAGE'] }
      }
    ]
  },
  {
    path: '/leader',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '领导管理',
        component: () => import('@/views/leader/list'),
        meta: { title: '领导管理', icon: 'form', roles: ['RR_LEADER_MANAGE'] }
      }
    ],
    meta: { roles: ['RR_LEADER_MANAGE'] }
  },
  {
    path: '/category',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '类别管理',
        component: () => import('@/views/category/list'),
        meta: { title: '类别管理', icon: 'form', roles: ['RR_CATEGORY_MANAGE'] }
      }
    ],
    meta: { roles: ['RR_CATEGORY_MANAGE'] }
  },
  {
    path: '/territory',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '领域管理',
        component: () => import('@/views/territory/list'),
        meta: { title: '领域管理', icon: 'form', roles: ['RR_TERRITORY_MANAGE'] }
      }
    ],
    meta: { roles: ['RR_TERRITORY_MANAGE'] }
  }
]
