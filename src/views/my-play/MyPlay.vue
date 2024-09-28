<template>
    <Teleport to="body">
        <div class="g-btmbar">
        <div class="m-playbar" :class="lock ? 'm-playbar-block' : 'm-playbar-unlock'">
            <div class="updn">
                <div class="left">
                    <i class="left-icon" :class="lock ? 'icon-block' : 'icon-unlock'" @click="handelLock"></i>
                </div>
                <div class="right"></div>
            </div>
            <div class="bg"></div>
            <div class="hand"></div>
        </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const lock = ref<boolean>(false)

    function handelLock() {
    lock.value = !lock.value;
    }
</script>

<style lang="scss" scoped>
.g-btmbar{
  position: fixed;
  zoom: 1;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  width: 100%;
  z-index: 1002;
  .m-playbar{
    position: absolute;
    zoom: 1;
    top: -10px;
    left: 0;
    width: 100%;
    height: 53px;
    margin: 0 auto;
    transition: all 0.5s;
    .bg{
      height: 53px;
      zoom: 1;
      margin-right: 67px;
      background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
      background-position: 0 0;
      background-repeat: repeat-x;
    }
    .hand{
      position: absolute;
      top: -10px;
      width: 100%;
      height: 20px;
      cursor: pointer;
    }
    .updn{
      position: relative;
      z-index: 11;
      .left{
        float: left;
        position: absolute;
        top: -14px;
        right: 15px;
        width: 52px;
        height: 67px;
        background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        background-position: 0 -380px;
        .left-icon{
          display: block;
          width: 18px;
          height: 18px;
          margin: 6px 0 0 17px;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
          cursor: pointer;
        }
        .icon-unlock{
          background-position: -80px -380px;
          &:hover{
            background-position: -80px -400px;
          }
        }
        .icon-block{
          background-position: -100px -380px;
          &:hover{
            background-position: -100px -400px;
          }
        }
      }
      .right{
        float: left;
        position: absolute;
        top: -1px;
        right: 0;
        width: 15px;
        height: 54px;
        background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        background-position: -52px -393px;
        pointer-events: none;
      }
    }
  }
  .m-playbar-unlock:hover{
    top: -53px;
  }
  .m-playbar-block{
    top: -53px;
  }
}
</style>