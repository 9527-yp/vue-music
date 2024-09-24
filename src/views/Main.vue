<script setup lang="ts">
import Header from '@/components/header.vue'
import Menu from '@/components/menu.vue'
</script>

<template>
  <div class="header">
    <Header />
    <Menu />
    <div class="">

    </div>
  </div>
  <RouterView />
</template>

<style lang="scss" scoped>
.header{
  width: 100%;
}
</style>