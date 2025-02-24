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
      {
        /** 歌手详情 */
        path: '/singer',
        name: 'singer',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/singer/singer.vue')
      },
      {
        /** 专辑详情 */
        path: '/album',
        name: 'album',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/album/album.vue')
      },
      {
        /** 电台节目详情 */
        path: '/dj-detail',
        name: 'djDetail',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/dj-detail/dj.vue')
      },
      {
        /** 电台详情 */
        path: '/radio-detail',
        name: 'radio',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/radio/radio.vue')
      },
      {
        /** 每日推荐 */
        path: '/home-recommend',
        name: 'recommend',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/recommend/recommend.vue')
      },
      {
        /** 首页-排行榜 */
        path: '/home-toplist',
        name: 'toplist',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/home-toplist/homeToplist.vue')
      },
      {
        /** 首页-歌单 */
        path: '/home-playList',
        name: 'homePlayList',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/home-playList/homePlayList.vue')
      },
      {
        /** 首页-主播电台 */
        path: '/home-djradio',
        name: 'homeDjradio',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/home-djradio/homeDjradio.vue')
      },
      {
        /** 首页-主播电台-二级模块 */
        path: '/home-djradio-category',
        name: 'homeDjradioCategory',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/home-djradio/homeDjradioCategory.vue')
      },
      {
        /** 首页-主播电台-推荐节目 */
        path: '/home-djradio-recommend',
        name: 'homeDjradioRecommend',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/home-djradio/homeDjradioRecommend.vue')
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
