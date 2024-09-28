<template>
    <div class="m-back" v-if="visible" @click="jumpTop"></div>
</template>

<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue';
    import { debounce } from 'lodash';

    const visible = ref(false);

    function toggleVisible(e: { target: Document }): void {
        const scrollTop =
            e.target.documentElement.scrollTop || e.target.body.scrollTop;

        if (scrollTop < 20) {
            visible.value = false;
        }

        if (!visible.value && scrollTop >= 20) {
            visible.value = true;
        }
    }

    function jumpTop(): void {
        window.scrollTo(0, 0);
    }

    onMounted(() => {
        document.addEventListener('scroll', debounce(toggleVisible, 100), false);
    });

    onUnmounted(() => {
        document.removeEventListener('scroll', () => ({}));
    });
</script>

<style lang="scss" scoped>
.m-back{
  display: block;
  position: fixed;
  text-indent: -9999px;
  left: 50%;
  margin-left: 500px;
  bottom: 160px;
  width: 49px;
  height: 44px;
  background: url('@/assets/images/sprite.png') no-repeat 0 9999px;
  background-position: -265px -47px;
  &:hover{
    background-position: -325px -47px;
  }
}
</style>