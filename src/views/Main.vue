<script setup lang="ts">
import Header from '@/components/header.vue'
import Menu from '@/components/menu.vue'
import FootView from '@/views/foot-view/FootView.vue';
import BackUpper from '@/components/back-upper/BackUpper.vue'
</script>

<template>
  <div class="header">
    <Header />
    <Menu />
  </div>
  <RouterView />
  <FootView />
  <BackUpper />
</template>

<style lang="scss" scoped>
.header{
  width: 100%;
}
</style>