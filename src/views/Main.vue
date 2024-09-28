<script setup lang="ts">
import Header from '@/components/header.vue'
import Menu from '@/components/menu.vue'
import FootView from '@/views/foot-view/FootView.vue';
import MyPlay from '@/views/my-play/MyPlay.vue';
import BackUpper from '@/components/back-upper/BackUpper.vue'
</script>

<template>
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
</template>

<style lang="scss" scoped>
.header{
  width: 100%;
}
</style>