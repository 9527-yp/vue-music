<template>
    <div class="h-top">
      <div class="h-warp">
        <div class="logo"></div>
        <ul class="nav">
          <li class="item active-item">发现音乐</li>
          <li class="item">我的音乐</li>
          <li class="item">关注</li>
          <li class="item">商城</li>
          <li class="item">音乐人</li>
          <li class="item">云推歌</li>
          <li class="item">下载客户端</li>
        </ul>
        <div class="other">
          <div class="search">
            <input class="search-input" type="text" placeholder="音乐/视频/电台/用户">
          </div>
          <div class="create">
            <a class="link" href="">创作者中心</a>
          </div>
          <div class="login" @click="login">登录</div>
        </div>
      </div>
    </div>
    <teleport to="body">
      <LoginDialog v-model:loginDialog="loginDialog"/>
    </teleport>
</template>

<script setup lang="ts">
import LoginDialog from '@/components/login/LoginDialog.vue'

import { ref } from 'vue';

const loginDialog = ref(false)

function login():void {
  loginDialog.value = true;
}
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
          color: #ccc;
          line-height: 70px;
          padding: 0 19px;
          cursor: pointer;
          &:hover{
            background: #000;
            color: #fff;
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
          &:hover{
            text-decoration: underline;
          }
        }
      }
    }
  }
</style>