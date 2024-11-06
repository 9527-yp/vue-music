import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => 
        import( /* webpackChunkName: "home" */'../views/home/Home.vue'),
      },
      {
        path: '/my-music',
        name: 'my-music',
        component: () =>
        import( /* webpackChunkName: "my-music" */ '../views/my-music/MyMusic.vue')
      },
      {
        path: '/friend',
        name: 'friend',
        component: () =>
          import(/* webpackChunkName: "friend" */ '../views/friend/Friend.vue')
      },
      {
        path: '/download',
        name: 'download',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/download/Download.vue')
      },
      {
        path: '/user/home',
        name: 'userHome',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/user-home/userHome.vue')
      },
      {
        path: '/song/rank',
        name: 'songRank',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/song-rank/songRank.vue')
      },
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return { left: 0, top: 0 };
  }
})

export default router
