<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="openMessage" class="message-box">{{content}}</div>
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
      },1500)
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
    line-height: 40px;
    text-align: center;
    background:#fff;
    border: 1px solid #ccc;
    color: #000;
    font-size: 16px;
    border-radius: 5px;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.5);
}
</style>