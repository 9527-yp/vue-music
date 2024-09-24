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
  (newId, oldId) => {
    console.log('参数从', oldId, '变化到', newId);
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
    width: 320px;
    padding: 15px 20px;
    line-height: 40px;
    text-align: center;
    background:rgba(19, 19, 18, 0.8);
    color: #fff;
    font-size: 16px;
    border-radius: 5px;
}
</style>