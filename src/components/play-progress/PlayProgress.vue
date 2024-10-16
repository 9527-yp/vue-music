<template>
  <div id="progress" class="play-status-box" @click="handleProgressClick">
    <div class="bag">
      <!-- 缓存 -->
      <div class="rdy" :style="{ width: cacheProgress }"></div>
      <!-- 播放进度 -->
      <div class="cur" ref="currentProgressRef" :style="{ width: currentProgress }">
        <span class="status-icon" ref="roundProgressRef">
          <i class="icon-loading" v-show="loading"></i>
        </span>
      </div>
      <div class="total-progress" ref="totalProgressRef"></div>
    </div>
    <span class="time">
      <em>00:21</em>
      / 03:33
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';

const emits = defineEmits(['progressChange']);
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  current: {
    type: Number,
    default: 0
  },
  cache: {
    type: Number,
    default: 0
  }
})
type ProgressRef = HTMLDivElement | HTMLElement | null;

const roundProgressRef = ref<ProgressRef>(null);
const currentProgressRef = ref<ProgressRef>(null);
const totalProgressRef = ref<ProgressRef>(null);

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
  if(progress.isDrag){
    // 拖动时停止更新进度条
    return;
  }

  return props.current * 100 + '%';
})

const cacheProgress = computed(() => {
  return props.cache * 100 + '%';
})

// 鼠标按下
function mousedown(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    console.log(target.className, 'targettarget')
    if(target.className !== 'status-icon' && target.className !== 'icon-loading'){
        return;
    }

    progress.isDown = true;

    // 初始偏移量(当前偏移量 - 当前进度偏移量)
    const current = currentProgressRef.value as HTMLDivElement;
    progress.initOffest = e.clientX - current.offsetWidth;

}

// 鼠标移动
function mousemove(e: MouseEvent): void {
  // buttons 1为鼠标左键按下移动
  if (e.buttons !== 1 || !progress.isDown) {
    return;
  }
  const current = currentProgressRef.value as HTMLDivElement;
  const total = totalProgressRef.value as HTMLDivElement;

  // 当前偏移量 - 初始偏移量
  let moveX = e.clientX - progress.initOffest;
  // 边界判断
  if (moveX >= total.offsetWidth) {
    moveX = total.offsetWidth;
  }
  if (moveX <= 0) {
    moveX = 0;
  }

  // 拖动
  progress.isDrag = true;
  // 存储当前进度
  progress.current = moveX / total.offsetWidth;
  // 进度样式
  current.style.width = (moveX / total.offsetWidth) * 100 + '%';
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
    if(target.className === 'status-icon' || target.className === 'icon-loading'){
      return;
    }

    const current = currentProgressRef.value as HTMLDivElement;
    const total = totalProgressRef.value as HTMLDivElement;

    // 当前进度
    const totalOffestWidth = total.offsetWidth || 0;
    current.style.width = (e.offsetX / totalOffestWidth) * 100 + '%';

    emits('progressChange', e.offsetX / totalOffestWidth);
}
onMounted(() => {
    const progressDom = document.querySelector('#progress') as HTMLDivElement;

    // 监听鼠标按下、移动、放开事件
    progressDom.addEventListener('mousedown', mousedown, false);
    progressDom.addEventListener('mousemove', mousemove, false);
    progressDom.addEventListener('mouseup', mouseup, false);
})

onBeforeUnmount(() => {
  const progressDom = document.querySelector('#progress') as HTMLDivElement;

  // 移除监听鼠标按下、移动、放开事件
  progressDom.removeEventListener('mousedown', mousedown);
  progressDom.removeEventListener('mousemove', mousemove);
  progressDom.removeEventListener('mouseup', mouseup);
});
</script>
<style lang="scss" scoped>
.play-status-box {
  width: 466px;
  position: relative;
  .bag {
    width: 466px;
    height: 9px;
    background: url("@/assets/images/play/statbar.png") no-repeat 0 9999px;
    background-position: right 0;
    .rdy {
      // width: 90%;
      height: 9px;
      background: url("@/assets/images/play/statbar.png") no-repeat 0 9999px;
      background-position: right -30px;
    }
    .cur {
      position: absolute;
      top: 0;
      left: 0;
      // width: 9%;
      height: 9px;
      z-index: 2;
      background: url("@/assets/images/play/statbar.png") no-repeat 0 9999px;
      background-position: left -66px;
      .status-icon {
        position: absolute;
        top: -7px;
        right: -13px;
        width: 22px;
        height: 24px;
        margin-left: -11px;
        background: url("@/assets/images/play/iconall.png") no-repeat 0 9999px;
        background-position: 0 -250px;
        cursor: pointer;
        .icon-loading {
          position: absolute;
          left: 5px;
          top: 5px;
          width: 12px;
          height: 12px;
          background: url("@/assets/images/play/loading.gif");
        }
      }
    }
    .total-progress{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
    }
  }
  .time {
    position: absolute;
    top: -5px;
    right: -84px;
    color: #797979;
    text-shadow: 0 1px 0 #121212;
    em {
      color: #a1a1a1;
    }
  }
}
</style>