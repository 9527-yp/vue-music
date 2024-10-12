<template>
    <div class="m-vol" v-show="volume">
        <div class="barbg"></div>
        <div class="vbg" id="volume" @click="handleProgressClick">
            <div class="curr" :style="{height: currentProgress}" ref="volumeCurrRef">
                <i class="btn"></i>
            </div>
            <div class="total" ref="volumeTotalRef"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, computed } from 'vue';

const volume = defineModel('volume', {
    type: Boolean,
    default: false
})

const props = defineProps({
    volumeNum: {
        type: Number,
        default: 1
    }
})

/**
 * initOffest 初始偏移量
 * current 当前进度
 * isDown 鼠标左键按下
 * isDrag 是否拖动
 */
const progress = reactive({
  initOffest: 0,
  current: 0,
  isDown: false,
  isDrag: false
});

const currentProgress = computed(() => {
    // 拖动时停止更新进度条
    if(progress.isDrag){
        return ;
    }
    return props.volumeNum * 100 + '%';
})

type ProgressRef = HTMLDivElement | HTMLElement | null;

const volumeCurrRef = ref<ProgressRef>(null);
const volumeTotalRef = ref<ProgressRef>(null);

const emits = defineEmits(['progressChange']);

// 鼠标按下
function mousedown(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if(target.className !== 'btn'){
        return;
    }

    progress.isDown = true;

    // 初始偏移量(当前偏移量 - 当前进度偏移量)
    const current = volumeCurrRef.value as HTMLDivElement;
    const total = volumeTotalRef.value as HTMLDivElement;
    console.log(total.clientHeight, 'total.clientHeight')
    progress.initOffest = e.clientY - total.clientHeight + current.offsetHeight;

}

// 鼠标移动
function mousemove(e: MouseEvent): void {
  // buttons 1为鼠标左键按下移动
  if (e.buttons !== 1 || !progress.isDown) {
    return;
  }
  const current = volumeCurrRef.value as HTMLDivElement;
  const total = volumeTotalRef.value as HTMLDivElement;

  // 当前偏移量 - 初始偏移量

  let moveY = e.clientY - progress.initOffest;
  // 边界判断
  if (moveY >= total.offsetHeight) {
    moveY = total.offsetHeight;
  }
  if (moveY <= 0) {
    moveY = 0;
  }

  // 拖动
  progress.isDrag = true;
  // 存储当前进度
  progress.current = (total.offsetHeight - moveY) / total.offsetHeight;
  // 进度样式
  current.style.height = ((total.offsetHeight - moveY) / total.offsetHeight) * 100 + '%';
}

// 鼠标放开
function mouseup() {
    if (!progress.isDrag) {
      return;
    }
    progress.isDown = false;
    progress.isDrag = false;
    emits('progressChange', progress.current);
}

// 点击
function handleProgressClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if(target.className === 'btn'){
      return;
    }

    const current = volumeCurrRef.value as HTMLDivElement;
    const total = volumeTotalRef.value as HTMLDivElement;

    // 当前进度
    const totalOffestHeight = total.offsetHeight || 0;
    console.log(e.offsetY, 'e.offsetY')
    current.style.height = ((total.offsetHeight - e.offsetY) / totalOffestHeight) * 100 + '%';

    emits('progressChange', ((total.offsetHeight - e.offsetY) / totalOffestHeight));
}

onMounted(() => {
    const progressDom = document.querySelector('#volume') as HTMLDivElement;

    // 监听鼠标按下、移动、放开事件
    progressDom.addEventListener('mousedown', mousedown, false);
    progressDom.addEventListener('mousemove', mousemove, false);
    progressDom.addEventListener('mouseup', mouseup, false);
})

onBeforeUnmount(() => {
    const progressDom = document.querySelector('#volume') as HTMLDivElement;

    // 移除监听鼠标按下、移动、放开事件
    progressDom.removeEventListener('mousedown', mousedown);
    progressDom.removeEventListener('mousemove', mousemove);
    progressDom.removeEventListener('mouseup', mouseup);
})
</script>

<style lang="scss" scoped>
.m-vol{
    position: absolute;
    top: -113px;
    left: 9px;
    clear: both;
    width: 32px;
    height: 113px;
    .barbg{
    position: absolute;
    top: 0;
    left: 0;
    width: 32px;
    height: 113px;
    background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
    background-position: 0 -503px;
    }
    .vbg{
    position: absolute;
    left: 14px;
    width: 4px;
    height: 93px;
    padding: 4px 0;
    top: 7px;
    .curr{
        // height: 100%;
        width: 4px;
        position: absolute;
        top: auto;
        bottom: 4px;
        left: 0;
        background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        background-position: -40px bottom;
        // overflow: hidden;
    }
    .btn{
        position: absolute;
        top: -5px;
        left: -7px;
        display: block;
        width: 18px;
        height: 20px;
        background: url('@/assets/images/play/iconall.png') no-repeat 0 9999px;
        background-position: -40px -250px;
        cursor: pointer;
        z-index: 10;
    }
    }
}
.total{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>