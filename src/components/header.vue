<template>
    <div class="h-top">
      <div class="h-warp">
        <div class="logo" @click="logoJump"></div>
        <ul class="nav">
          <li class="item"
           v-for="(item, index) in menu"
           :key="index"
           :class="menuIndex == index ? 'active-item' : ''"
           @click="hanldMenu(item, index)">
            <router-link class="link" v-if="item?.path" :to="item?.path">
              {{ item?.title }}
            </router-link>
            <a v-else class="link" :href="item?.href" target="_blank">{{ item?.title }}</a>
          </li>
        </ul>
        <div class="other">
          <div class="search">
            <input class="search-input" type="text" placeholder="音乐/视频/电台/用户">
          </div>
          <div class="create">
            <a class="link" href="">创作者中心</a>
          </div>
          <div class="login" v-if="isLogin">
            <div class="user-avatar">
              <div class="user-img">
                <img :src="userStore.getUserInfo?.profile?.avatarUrl" alt="头像"/>
                <div class="msg-tag" v-if="msgCode > 0">{{ msgCode }}</div>
                <div class="user-box">
                  <User :msgCode="msgCode" />
                </div>
              </div>
            </div>
          </div>
          <div class="login" v-else @click="login">登录</div>
        </div>
      </div>
    </div>
    <div class="warning-tip" v-if="messageInfo.visible">
        <i v-if="messageInfo.type" class="success-icn"></i>
        <i v-else class="warning-icn"></i>
        <span class="text">{{messageInfo.text}}</span>
    </div>
</template>

<script setup lang="ts">
import User from '@/views/user/User.vue';
import useUserStore from '@/stores/modules/user.ts';
import useDialogStore from '@/stores/modules/dialog.ts';
import { getMsgCode } from '@/api/user.ts';
import type { ResponseType } from '@/types/index';
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from "vue-router";

// 用户信息数据
const userStore = useUserStore();
const dialogStore = useDialogStore();

// 路由跳转
const router = useRouter()
const route = useRoute()

const isLogin = computed<boolean>(() => userStore.getIsLogin);
const menuIndex = computed<number>(() => userStore.getMenuIndex);
const messageInfo = computed(() => dialogStore.getMessage);

// header 菜单列表
type MenuType = {
  title: string,
  path?: string,
  href?: string,
}
const menu = ref<MenuType[]>([
  {
    title: '发现音乐',
    path: '/',
  },
  {
    title: '我的音乐',
    path: '/my-music'
  },
  {
    title: '关注',
    path: '/friend'
  },
  {
    title: '商城',
    href: 'https://music.163.com/store/product'
  },
  {
    title: '音乐人',
    href: 'https://music.163.com/st/musician'
  },
  {
    title: '云推歌',
    href: 'https://music.163.com/st/ad-song'
  },
  {
    title: '下载客户端',
    path: '/download'
  },
])
// 菜单切换
function hanldMenu(item: MenuType, index: number){
  if(!item?.path){
    return ;
  }
  userStore.setMenuIndex(index)
}

// 消息提示
const msgCode = ref(0)
function loadMessage(): void {
  getMsgCode({ limit: 1, offset: 100 })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        msgCode.value = res?.newMsgCount || 0;
      }
    })
    .catch(() => ({}));
}

function logoJump() {
  if(route.path !== '/'){
    router.push('/')
  }
}

// 登录
function login():void {
  userStore.setLoginDialogShow(true)
}

watch(() => isLogin.value,
  () => {
    if(!isLogin.value){
      return;
    }
    loadMessage()
  },{immediate: true}
)

watch(() => route.path,
  (path) => {
    let index = menu.value.findIndex(item => item.path == path )
    if(index !== -1){
      userStore.setMenuIndex(index);
    }
  },{immediate: true}
)
</script>


<style lang="scss" scoped>
.h-top{
    width: 100%;
    height: 70px;
    border-bottom: 1px solid #000;
    background: #242424;
    box-sizing: border-box;
    .h-warp{
      width: 1100px;
      height: 100%;
      margin: 0 auto;
      position: relative;
      .logo{
        width: 176px;
        height: 69px;
        cursor: pointer;
        display: inline-block;
        background: url('../assets/nusic-icon.png') no-repeat 0 9999px;
        background-position: 0 0;
      }
      .nav{
        display: inline-block;
        height: 100%;
        line-height: 70px;
        vertical-align: top;
        .item{
          position: relative;
          display: inline-block;
          height: 100%;
          font-size: 14px;
          // color: #ccc;
          // line-height: 70px;
          // padding: 0 19px;
          vertical-align: middle;
          cursor: pointer;
          &:hover{
            background: #000;
            color: #fff;
          }
          .link{
            display: inline-block;
            width: 100%;
            height: 100%;
            color: #ccc;
            line-height: 70px;
            padding: 0 19px;
            vertical-align: middle;
          }
        }
        .active-item{
          background: #000;
          color: #fff;
          &::before{
            content: '';
            width: 12px;
            height: 7px;
            position:absolute;
            bottom: -1px;
            left: 50%;
            margin-left: -3.5px;
            background: url('../assets/nusic-icon.png') no-repeat 0 9999px;
            background-position: -226px 0;
          }
        }
      }
      .other{
        position: absolute;
        top: 0;
        right: 20px;
        height: 70px;
        line-height: 70px;
        vertical-align: top;
        .search{
          position: relative;
          display: inline-block;
          .search-input{
            display: inline-block;
            width: 128px;
            height: 32px;
            padding-left: 30px;
            line-height: 32px;
            border: none;
            border-radius: 32px;
            outline: none;
          }
        }
        .create{
          display: inline-block;
          margin-left: 12px;
          .link{
            display: inline-block;
            width: 90px;
            height: 32px;
            line-height: 31px;
            color: #ccc;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #4f4f4f;
            border-radius: 20px;
            box-sizing: border-box;
            &:hover{
              border-color: #fff;
            }
          }
        }
        .login{
          position: relative;
          z-index: 11;
          display: inline-block;
          width: 28px;
          height: 70px;
          margin-left: 20px;
          color: #787878;
          vertical-align: middle;
          cursor: pointer;
          .user-avatar{
            position: relative;
            height: 70px;
            .user-img{
              position: absolute;
              top: 50%;
              width: 30px;
              height: 30px;
              line-height: 30px;
              cursor: pointer;
              position: relative;
              transform: translateY(-50%);
              img{
                width: 100%;
                height: 100%;
                border-radius: 30px;
              }
              .user-box{
                display: none;
                position: absolute;
                top:30px;
                right: -63px;
                padding-top: 10px;
                &::before {
                  position: absolute;
                  top: -6px;
                  left: 50%;
                  width: 0;
                  height: 0;
                  border: 8px solid;
                  content: '';
                  transform: translateX(-50%);
                  border-color: transparent transparent #2b2b2b;
                }
              }
              &:hover{
                .msg-tag{
                  display: none;
                }
                .user-box{
                  display: block;
                }
              }
            }
            .msg-tag {
              position: absolute;
              top: 0px;
              left: 20px;
              display: inline-block;
              height: 17px;
              min-width: 17px;
              padding: 0 4px;
              font-size: 12px;
              line-height: 16px;
              color: #fff;
              text-align: center;
              white-space: nowrap;
              background: #c20c0c;
              border: 1px solid #242424;
              border-radius: 18px;
              box-sizing: border-box;
            }
          }
          &:hover{
            text-decoration: underline;
          }
        }
      }
    }
  }
.warning-tip{
  width: 280px;
  background: #fff;
  color: #333;
  line-height: 52px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  position: fixed;
  top:50%;
  left: 50%;
  z-index: 20002;
  margin-left: -140px;
  margin-top: -300px;
  // transform: translate(-50%, -50%);
  vertical-align: middle;
  .warning-icn{
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 3px;
      background: url('@/assets/images/icon.png') no-repeat;
      background-position: -24px -406px;
  }
  .success-icn{
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 3px;
      background: url('@/assets/images/icon.png') no-repeat;
      background-position: -24px -430px;
  }
  .text{
      display: inline-block;
      vertical-align: middle;
  }
}
</style>