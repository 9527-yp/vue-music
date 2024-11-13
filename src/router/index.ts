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
        /** 个人主页 */
        path: '/user/home',
        name: 'userHome',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/user-home/userHome.vue')
      },
      {
        /** 听歌记录查看更多 */
        path: '/song/rank',
        name: 'songRank',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/song-rank/songRank.vue')
      },
      {
        /** 动态 */
        path: '/user/Social',
        name: 'userSocial',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/user-social/userSocial.vue')
      },
      {
        /** 关注 */
        path: '/user/follows',
        name: 'userFollows',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/user-follows/userFollows.vue')
      },
      {
        /** 粉丝 */
        path: '/user/fans',
        name: 'userFans',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/user-fans/userFans.vue')
      },
      {
        /** 歌单 */
        path: '/playList',
        name: 'playList',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/play-list/playList.vue')
      },
      {
        /** 歌曲详情 */
        path: '/song',
        name: 'song',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/song/song.vue')
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
