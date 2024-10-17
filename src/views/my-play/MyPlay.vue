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
            <!-- 播放器实例组件 -->
            <Audio
              :src="playUrl"
              :volume="volumeNum"
              ref="audioRef"
              @timeupdate="audioTimeUpdate"
              @ended="audioTimeEnded" 
            />
            <div class="bg"></div>
            <div class="hand"></div>
            <div class="wrap">
              <div class="btns">
                <i class="prev" title="上一首" @click="upPlaySong(mode.modeIndex)"></i>
                <i :class="playStatus.look ? 'pause' : 'play'" title="播放/暂停" @click="togglePlayStatus"></i>
                <i class="nxt" title="下一首" @click="nextPlatSong(mode.modeIndex)"></i>
              </div>
              <div class="head">
                <img class="song-img" :src="playSongItem?.picUrl" alt="">
                <i class="mask"></i>
              </div>
              <div class="play">
                <div class="words">
                  <span class="song song-name">{{ playSongItem.name }}</span>
                  <span class="song song-sing">
                    <span v-for="(item, index) in playSongItem.artists" :key="item.id" :title="item.name">{{item.name}}<i v-show="index !== playSongItem.artists.length-1">/</i></span>
                  </span>
                  <i class="src" title="来自榜单"></i>
                </div>
                <!-- 播放条 -->
                <PlayProgress
                 :loading="playStatus.loading"
                 :current="playProgress.progress" 
                 :cache="playProgress.cacheProgress"
                 :currentTime="playProgress.currentTime"
                 :duration="playProgress.duration"
                 @progressChange="audioProgressChange" />
              </div>
              <div class="oper">
                <i class="icn icn-pip" title="画中画歌词"></i>
                <i class="icn icn-add" title="收藏"></i>
                <i class="icn icn-share" title="分享"></i>
              </div>
              <div class="ctrl">
                <!-- 音量调节 -->
                <PlayVolume 
                 :volumeNum="volumeNum" 
                 v-model:volume="volume" 
                 @progressChange="volumeProgressChange"
                />
                <i class="icn icn-vol" @click="volumeShow"></i>
                <i class="icn icn-one" title="单曲循环" v-if="mode.modeIndex === 1" @click="modeChange('单曲循环')"></i>
                <i class="icn icn-loop" title="循环" v-if="mode.modeIndex === 2" @click="modeChange('循环')"></i>
                <i class="icn icn-shuffle" title="随机" v-if="mode.modeIndex === 3" @click="modeChange('随机')"></i>
                <div class="mode-tooltip" v-show="mode.visible">{{mode.modeName}}</div>
                <span class="add" @click="playListChange">
                  <span class="tip">已添加到播放列表</span>
                  <i class="icn icn-list">{{playSongList.length}}</i>
                  <i class="icn icn-audioquality"></i>
                </span>
              </div>
              <!-- 播放列表 -->
              <PlayList v-model:playListShow="playListShow" />
            </div>
        </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
    import { ref, computed, reactive, watch } from 'vue';
    import PlayProgress from '@/components/play-progress/PlayProgress.vue'
    import PlayVolume from '@/components/play-volume/PlayVolume.vue'
    import Audio from '@/components/audio/Audio.vue'
    import PlayList from '@/components/play-list/PlayList.vue'
    import type { ResponseType } from '@/types/index';
    import usePlayStore from '@/stores/modules/play.ts'
    import { getSongPlayUrl } from '@/api/my-music.ts'
    import type { MusicItemType } from '@/hooks/methods/songFormat.ts'
    import { upPlaySong, nextPlatSong } from './methods/methods'

    const playStore = usePlayStore()

    // 当前播放的歌曲详情
    const playSongItem = computed(() => playStore.getPlaySongItem)
    // 播放列表数据
    const playSongList = computed(() => playStore.playSongList)
    // 播放显示/隐藏
    const lock = ref<boolean>(true)
    // 音量条显示/隐藏
    const volume = ref<boolean>(false)

    // 歌曲url
    const playUrl = ref<string>('');
    function getAudioPlayUrl() {
      return getSongPlayUrl({id: playSongItem.value.id}).then((res: ResponseType) => {
        if(res.code === 200) {
          playUrl.value = res.data?.[0]?.url ?? '';
        }
      })
    }
    getAudioPlayUrl();

    // 播放器实例组件ref
    const audioRef = ref();

    // 播放状态
    const playStatus = ref({
      loading: false,
      look: false
    });
    // 播放/暂停操作
    function togglePlayStatus() {
      if(!playSongItem.value || playSongList.value.length === 0){
        return ;
      }
      playStatus.value.loading = true;
      playStatus.value.look = !playStatus.value.look

      if(audioRef.value && playStatus.value.look) {
        console.log('播放')
        audioRef.value.ref.play();
      }

      if (audioRef.value && !playStatus.value.look) {
        console.log('暂停')
        audioRef.value.ref.pause();
      }
      playStatus.value.loading = false;
    }

    // 播放进度
    const playProgress = ref({
      currentTime: 0, // 当前播放时间位置
      duration: 0, // 音频的长度
      progress: 0, // 播放进度
      cacheProgress: 0, // 缓存进度
      manualUpdate: false
    });

    // 播放时间更新
    function audioTimeUpdate(currentTime: number, duration: number, cache: number) {
      if (playProgress.value.manualUpdate) {
        return;
      }
      playProgress.value = {
        ...playProgress.value,
        currentTime: currentTime,
        duration: duration,
        progress: currentTime / duration,
        cacheProgress: cache / duration
      }
    }

    // 播放结束
    function audioTimeEnded() {
      if(mode.modeIndex === 1){
        audioRef.value.ref.play();
        return;
      }
      nextPlatSong(mode.modeIndex);
    }

    // 播放进度拖拽
    function audioProgressChange(value: number): void {
      playProgress.value.manualUpdate = true;

      playProgress.value = {
        ...playProgress.value,
        currentTime: playProgress.value.duration * value,
        progress: value,
      }

      // 更新播放时间
      audioRef.value.ref.currentTime = playProgress.value.duration * value;

      playProgress.value.manualUpdate = false;
    }

    // 播放列表显示/隐藏
    const playListShow = ref<boolean>(false);
    function playListChange() {
      playListShow.value = !playListShow.value
    }

    watch(() => playSongItem.value,
    async () => {
      if(!playSongItem.value) {
        return;
      }
      playStatus.value.loading = true;
      playProgress.value.progress = 0;
      playProgress.value.cacheProgress = 0;
      playProgress.value.manualUpdate = true;
      audioRef.value.ref.pause();
      playStatus.value.look = true;
      await getAudioPlayUrl()
      audioRef.value.ref.play();

      playStatus.value.loading = false;
      playProgress.value.manualUpdate = false;
    })

    // 音量加减操作
    const volumeNum = ref(1)
    function volumeProgressChange(value: number) {
      volumeNum.value = value;
    }

    // 播放器显示/隐藏
    function handelLock() {
    lock.value = !lock.value;
    }

    // 音量操作显示/隐藏
    function volumeShow() {
      volume.value = !volume.value
    }

    type ModeItem = {
      modeIndex: number,
      modeName: string,
      visible: boolean,
      timer: NodeJS.Timeout | null
    }
    // 播放模式切换
    const mode = reactive<ModeItem>({
      modeIndex: 1,
      modeName: '单曲循环',
      visible: false,
      timer: null,
    })
    function modeChange(value: string) {
      mode.modeName = value
      mode.visible = true
      if(mode.modeIndex !== 3){
        mode.modeIndex++
      }else{
        mode.modeIndex = 1
      }
      mode.timer && clearTimeout(mode.timer)
      mode.timer = setTimeout(() => {
        mode.visible = false
      }, 1000)
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
    .wrap{
      width: 1030px;
      height: 47px;
      position: absolute;
      top: 6px;
      left: 50%;
      margin-left: -515px;
      z-index: 15;
      .btns{
        width: 137px;
        padding-top: 6px;
        float: left;
        i{
          display: block;
          float: left;
          width: 28px;
          height: 28px;
          margin-right: 8px;
          margin-top: 5px;
          text-indent: -9999px;
          cursor: pointer;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        }
        .prev{
          background-position: 0 -130px;
          &:hover{
            background-position: -30px -130px;
          }
        }
        .play{
          width: 36px;
          height: 36px;
          margin-top: 0;
          background-position: 0 -204px;
          &:hover{
            background-position: -40px -204px;
          }
        }
        .pause{
          width: 36px;
          height: 36px;
          margin-top: 0;
          background-position: 0 -165px;
          &:hover{
            background-position: -40px -165px;
          }
        }
        .nxt{
          background-position: -80px -130px;
          &:hover{
            background-position: -110px -130px;
          }
        }
      }
      .head{
        position: relative;
        margin: 6px 15px 0 0;
        width: 34px;
        height: 34px;
        float: left;
        .song-img{
          width: 34px;
          height: 34px;
        }
        .mask{
          position: absolute;
          top: 0px;
          left: 0px;
          display: block;
          width: 34px;
          height: 35px;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
          background-position: 0 -80px;
        }
      }
      .play{
        width: 581px;
        position: relative;
        float: left;
        .words{
          height: 28px;
          overflow: hidden;
          color: #e8e8e8;
          text-shadow: 0 1px 0 #171717;
          line-height: 28px;
          .song{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            float: left;
            cursor: pointer;
            &:hover{
              text-decoration: underline;
            }
          }
          .song-name{
            max-width: 300px;
            color: #e8e8e8;
          }
          .song-sing{
            max-width: 220px;
            margin-left: 15px;
            color: #9b9b9b;
          }
          .src{
            float: left;
            width: 14px;
            height: 15px;
            margin: 7px 0 0 13px;
            background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
            background-position: -110px -103px;
            &:hover{
              background-position: -130px -103px;
            }
          }
        }
      }
      .oper{
        width: 87px;
        float: left;
        .icn{
          float: left;
          width: 25px;
          height: 25px;
          margin: 11px 2px 0 0;
          text-indent: -9999px;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        }
        .icn-pip{
          position: relative;
          background: url('@/assets/images/play/icn-pip.png') no-repeat 0 0;
          &:hover{
            background-position-y: -25px;
          }
        }
        .icn-add{
          background-position: -88px -163px;
          &:hover{
            background-position: -88px -189px;
          }
        }
        .icn-share{
          background-position: -114px -163px;
          &:hover{
            background-position: -114px -189px;
          }
        }
      }
      .ctrl{
        position: relative;
        z-index: 10;
        width: 160px;
        padding-left: 13px;
        background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        background-position: -147px -238px;
        float: left;
        .icn{
          float: left;
          width: 25px;
          height: 25px;
          margin: 11px 2px 0 0;
          cursor: pointer;
          text-indent: -9999px;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
        }
        .icn-vol{
          background-position: -2px -248px;
          &:hover{
            background-position: -31px -248px;
          }
        }
        .icn-one{
          background-position: -66px -344px;
          &:hover{
            background-position: -93px -344px;
          }
        }
        .icn-loop{
          background-position: -3px -344px;
          &:hover{
            background-position: -33px -344px;
          }
        }
        .icn-shuffle{
          background-position: -66px -248px;
          &:hover{
            background-position: -93px -248px;
          }
        }
        .add{
          float: left;
          width: 59px;
          height: 36px;
          position: relative;
          zoom: 1;
          .tip{
            display: none;
            position: absolute;
            top: -51px;
            left: -65px;
            clear: both;
            width: 152px;
            height: 49px;
            background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
            background-position: 0 -287px;
            text-align: center;
            color: #fff;
            line-height: 37px;
          }
          .icn-list{
            display: block;
            float: none;
            width: 38px;
            padding-left: 21px;
            background-position: -42px -68px;
            line-height: 27px;
            text-align: center;
            color: #666;
            text-shadow: 0 1px 0 #080707;
            text-indent: 0;
            text-decoration: none;
            &:hover{
              background-position: -42px -98px;
              text-decoration: none;
            }
          }
          .icn-audioquality{
            background: url('@/assets/images/play/audio-quality.png');
            background-size: 45px 30px;
            margin-left: 4px;
            width: 41px;
            margin-top: 9px;
            &:hover{
              background: url('@/assets/images/play/audio-quality-hover.png');
            }
          }
        }
        .mode-tooltip{
          position: absolute;
          top: -35px;
          left: 12px;
          width: 81px;
          height: 39px;
          color: #fff;
          text-align: center;
          line-height: 34px;
          clear: both;
          background: url('@/assets/images/play/playbar.png') no-repeat 0 9999px;
          background-position: 0 -457px;
        }
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