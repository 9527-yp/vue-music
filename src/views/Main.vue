<script setup lang="ts">
import Header from '@/components/header.vue'
import Menu from '@/components/menu.vue'
import FootView from '@/views/foot-view/FootView.vue';
import MyPlay from '@/views/my-play/MyPlay.vue';
import BackUpper from '@/components/back-upper/BackUpper.vue'
import LoginDialog from '@/components/login/LoginDialog.vue'
import SongListDialog from '@/components/song-list-dialog//SongListDialog.vue'
</script>

<template>
<!-- 头部 -->
  <div class="header">
    <Header />
    <Menu />
  </div>
  <RouterView />
  <!-- foot -->
  <FootView />
  <!-- 回到顶部 -->
  <BackUpper />
  <!-- 底部播放 -->
  <MyPlay />
  <!-- 登录弹框 -->
  <teleport to="body">
    <LoginDialog />
  </teleport>
  <!-- 歌单弹框 -->
  <teleport to="body">
    <SongListDialog />
  </teleport>
</template>

<style lang="scss" scoped>
.header{
  width: 100%;
}
</style>