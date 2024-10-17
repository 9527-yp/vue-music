<template>
    <audio
     ref="audioRef"
     class="audio"
     :src="src"
     :volume="volume"
     @play="play"
     @timeupdate="timeupdate"
     @pause="pause"
     @ended="ended">
    </audio>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
    src: {
        type: String,
        default: ''
    },
    volume: {
        type: Number,
        default: 1
    }
})

const audioRef = ref<HTMLVideoElement | null>(null);

const emits = defineEmits(['play', 'timeupdate', 'pause', 'ended']);
defineExpose({
  ref: audioRef
});
// 播放
function play() {
    emits('play');
}
// 播放时间更新
function timeupdate(e: Event): void {
    const target = e.target as HTMLAudioElement;
    if(!target.currentTime || !target.duration){
        return ;
    }
    emits(
        'timeupdate',
        target.currentTime,
        target.duration,
        target.buffered.end(0)
    );
}
// 播放暂停
function pause() {
    emits('pause');
}
// 播放结束
function ended() {
    emits('ended');
}
</script>

<style lang="scss" scoped>
.audio{
    position: fixed;
    top: 241016;
}
</style>