import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

// 路由规则
const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    // 路由懒加载的方式导入组件，打包后会默认会生成：1.js 2.js 这样的模块文件，
    // 不方便调试查看，可以通过多行注释指定打包后生成的模块名 login
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'home',
    component: Layout,
    // meta: {
    //   requiresAuth: true // 直接在父路由上加访问权限的信息后 子路由中就可以不用写了 但不太灵活
    // },
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */ '@/views/home/index.vue'),
        meta: {
          requiresAuth: true // meta 默认就是一个空对象，可以在其中自定义属性数据（需要登录才能访问）
        }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue'),
        meta: {
          requiresAuth: true // 没有配置这个自定义属性的就代表：没有登录也可以访问，这样就很灵活
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue')
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/create.vue')
      },
      {
        path: '/menu/:id/edit', // 动态路由
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue')
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫：任何页面的访问都要经过这里
// to: 要去哪里的路由信息
// from: 从哪里来的路由信息
// next: 通过的标志，是一个方法
router.beforeEach((to, from, next) => {
  // console.log('to => ', to)
  // console.log('from => ', from)
  // to.matched 是匹配到的路由记录（包括父子路由），遍历这个路由记录，
  // 判断是否需要登录才能访问（父子路由中只要有路由需要访问权限就走验证）
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 此路由需要身份认证
    if (!store.state.user) {
      // 跳转到登录页
      next({
        name: 'login',
        // 告诉登录页 要去哪个路由，自定义数据
        // 通过 url 传递 查询字符串 参数
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next() // 有登录信息 - 允许通过
    }
  } else {
    // 不需要身份认证 - 直接通过
    next()
  }
})

export default router
