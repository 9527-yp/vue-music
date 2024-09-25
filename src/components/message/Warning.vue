<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="openMessage" class="message-box">
                <span class="warning-icon"></span>
                <div class="text">{{content}}</div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
const openMessage = defineModel('openMessage', {
    type: Boolean,
    default: false
})

defineProps({
    content: {
        type: String,
        default: ''
    }
})

watch(
  openMessage,
  (newId) => {
    if(newId){
      setTimeout(() => {
        openMessage.value = false
      },1000)
    }
  }
);

</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.message-box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2024101;
    padding: 10px 15px;
    width: 220px;
    text-align: center;
    background:#fff;
    border: 1px solid #ccc;
    color: #000;
    font-size: 16px;
    border-radius: 5px;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.5);
    .warning-icon{
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('@/assets/images/icon.png') no-repeat;
        background-position: -25px -405px;
        vertical-align: middle;
        margin-right: 5px;
    }
    .text{
        display: inline-block;
        vertical-align: middle;
    }
}
</style>