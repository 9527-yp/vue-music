<template>
  <div class="m-info">
    <div class="m-cover">
      <img
        class="img"
        :src="`${albumInfo?.picUrl}?param=177y177`"
        alt
      />
      <span class="msk"></span>
    </div>
    <div class="cnt">
      <div class="cntc">
        <div class="m-top-info">
          <div class="hd">
            <i class="tit-icn"></i>
            <div class="tit">
              <h2>{{albumInfo?.name}}</h2>
            </div>
          </div>
          <div class="intr">
            <b>歌手：</b>
            <template v-for="item in albumInfo?.artists" :key="item.id">
                <span class="text-hov text" @click="skip(item.id)">{{item?.name}}</span>
            </template>
          </div>
          <div class="intr">
            <b>发行时间：</b>
            <span>{{formatDateTime(albumInfo?.publishTime / 1000, 'Y-M-D')}}</span>
          </div>
        </div>
        <div class="m-btns">
          <span class="btns-bag play" title="播放" @click="playorAdd('play')">
            <i class="i-box btns-bag">
              <i class="play-icn btns-bag"></i>
              播放
            </i>
          </span>
          <span class="add btns-bag" title="添加到播放列表" @click="playorAdd('add')"></span>
          <span class="btns-bag btn-jointly collect" @click="collectMusic">
            <i class="collect-icn icn btns-bag">收藏</i>
          </span>
          <span class="btns-bag btn-jointly share" @click="notFeatureTip">
            <i class="share-icn icn btns-bag">分享</i>
          </span>
          <span class="btns-bag btn-jointly down" @click="notFeatureTip">
            <i class="down-icn icn btns-bag">下载</i>
          </span>
          <span class="btns-bag btn-jointly review" @click="jumpToComment">
            <i class="review-icn icn btns-bag">评论</i>
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="n-albdesc">
    <h3>专辑介绍：</h3>
    <div class="album-desc-dot">
      <p v-html="albumInfo?.description"></p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { formatDateTime } from '@/utils/utils';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useDialogStore from '@/stores/modules/dialog.ts';

const playStore = usePlayStore();
const dialogStore = useDialogStore();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

const props = defineProps({
  albumInfo: {
    type: Object,
    default: {}
  },
  list: {
    type: Array,
    default: []
  }
})

const playDialog = defineModel('playDialog', {
  type: Boolean,
  default: false
})

const playDialogText = defineModel('playDialogText', {
  type: String,
  default: ''
})

const emit = defineEmits(['jumpToComment','skip']);

function jumpToComment() {
  emit('jumpToComment')
}

function skip(id: number) {
  emit('skip',{path: '/singer', id})
}
// 播放 or 添加到播放列表
let timer = null;
function playorAdd(type: string): undefined {

  let list = props.list.filter((item) => isCopyright(item.id) === 2 );

  if(props.list.length === 0){
      playDialogText.value = '专辑还没有添加歌曲';
      playDialog.value = true;
      return;
  }else if(list.length === 0){
      playDialogText.value = '因合作方要求，该资源暂时无法收听，我们正在努力争取歌曲回归';
      playDialog.value = true;
      return;
  }
  
  if(type === 'play') {
    usePlaySong(list[0]);
    // 播放，需先清空当前的播放列表
    useSongAddPlaylist(list, {clear: true});
  }

  if(type === 'add') {
    useSongAddPlaylist(list);
  }
  playStore.setAddPlayListTip(true)
  playStore.setAddPlayListTipText(type === 'play' ? '已开始播放' : '已添加到播放列表')
  if(!lock.value){
      playStore.setPlayLock(true)
  }
  timer && clearTimeout(timer)
  timer = setTimeout(() => {
      playStore.setPlayLock(false)
      playStore.setAddPlayListTip(false)
  }, 1500)
}

// 收藏
function collectMusic() {
  if(props.list.length === 0){
    playDialogText.value = '专辑还没有添加歌曲';
    playDialog.value = true;
    return;
  }

  const ids = props.list.map((item: { id: number }) => item.id)
  dialogStore.setSongId(ids.join());
  dialogStore.setSongListShow(true);
}

function notFeatureTip() {
  dialogStore.setMessage({
      type: 0,
      text: '功能暂未开发',
      visible: true,
  })
  timer && clearTimeout( timer);
  timer = setTimeout(() => {
      dialogStore.setMessage({
          type: 0,
          text: '功能暂未开发',
          visible: false,
      })
  }, 1500);
}

// 歌曲是否有版权
type itemType = {
    privilege?: {
        cp: number,
        dl: number,
        fee: number
    }
}

function isCopyright(id: number): number | undefined {
    const item: itemType = props.list.find(
        (item: { id: number }) => item.id === id
    );
    if (item?.privilege?.dl === 0) {
        if(item?.privilege.fee === 0){
            // 无版权
            return 0;
        }else if(item?.privilege.fee === 1){
            // 付费歌曲
            return 1;
        }
    }else{
        // 可播放歌曲
        return 2;
    }
}
</script>

<style lang="scss" scoped>
.m-info {
  .m-cover {
    float: left;
    position: relative;
    width: 177px;
    height: 177px;
    margin: 0 -220px 0 0;
    .img {
      width: 100%;
      height: 100%;
    }
    .msk {
      position: absolute;
      top: 0;
      left: 0;
      width: 209px;
      height: 177px;
      background: url("@/assets/images/home/name-D5CGUEo8.png") no-repeat;
      background-position: 0 -986px;
    }
  }
  .cnt {
    float: right;
    width: 100%;
    .cntc {
      margin-left: 230px;
      .m-top-info {
        margin-bottom: 20px;
        .hd {
          position: relative;
          margin: 0 0 12px;
          line-height: 24px;
          .tit-icn {
            width: 54px;
            height: 24px;
            float: left;
            overflow: hidden;
            vertical-align: middle;
            background: url("@/assets/images/icon.png") no-repeat;
            background-position: 0 -186px;
          }
          .tit {
            margin-left: 64px;
            position: relative;
            color: #333;
            h2 {
              line-height: 24px;
              font-size: 20px;
              font-weight: normal;
              font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
            }
          }
          &:after {
            clear: both;
            content: ".";
            display: block;
            height: 0;
            visibility: hidden;
          }
        }
        .intr {
          margin-top: 4px;
          line-height: 18px;
          color: #666;
          b {
            display: inline-block;
            font-weight: normal;
          }
          .text {
            color: #0c73c2;
          }
        }
      }
      .m-btns {
        margin-bottom: 25px;
        width: 100%;
        height: 31px;
        display: flex;
        align-items: center;
        .btns-bag {
          background: url("@/assets/images/login/button-bag.png") no-repeat;
        }
        .play {
          padding: 0 5px 0 0;
          line-height: 29px;
          white-space: nowrap;
          overflow: hidden;
          text-align: center;
          cursor: pointer;
          color: #fff;
          background-position: right -428px;
          .i-box {
            display: inline-block;
            height: 31px;
            line-height: 29px;
            padding: 0 7px 0 8px;
            background-position: 0 -387px;
            .play-icn {
              display: inline-block;
              vertical-align: top;
              width: 20px;
              height: 18px;
              margin: 6px 2px 2px 0;
              background-position: 0 -1622px;
              overflow: hidden;
            }
          }
          &:hover {
            color: #fff;
            background-position: right -510px;
            .i-box {
              background-position: 0 -469px;
            }
            .play-icn {
              background-position: -28px -1622px;
            }
          }
        }
        .add {
          margin-right: 5px;
          font-family: simsun, \5b8b\4f53;
          width: 31px;
          margin-left: -3px;
          height: 31px;
          line-height: 30px;
          min-width: 23px;
          cursor: pointer;
          background-position: 0 -1588px;
          &:hover {
            background-position: -40px -1588px;
          }
        }
        .btn-jointly {
          margin-right: 6px;
          font-family: simsun, \5b8b\4f53;
          color: #333;
          padding: 0 5px 0 0;
          white-space: nowrap;
          cursor: pointer;
          .icn {
            display: inline-block;
            height: 31px;
            line-height: 30px;
            min-width: 23px;
            padding-right: 2px;
            padding-left: 28px;
          }
        }
        .collect {
          background-position: right -1020px;
          .collect-icn {
            background-position: 0 -977px;
          }
        }
        .share {
          background-position: right -1020px;
          .share-icn {
            background-position: 0 -1225px;
          }
          &:hover {
            background-position: right -1106px;
            .share-icn {
              background-position: 0 -1268px;
            }
          }
        }
        .down {
          background-position: right -1020px;
          .down-icn {
            background-position: 0 -2761px;
          }
          &:hover {
            background-position: right -1106px;
            .down-icn {
              background-position: 0 -2805px;
            }
          }
        }
        .review {
          background-position: right -1020px;
          .review-icn {
            background-position: 0 -1465px;
          }
          &:hover {
            background-position: right -1106px;
            .review-icn {
              background-position: 0 -1508px;
            }
          }
        }
      }
    }
  }
  &:after {
    clear: both;
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
  }
}
.n-albdesc {
  margin-top: 20px;
  h3 {
    font-size: 100%;
  }
  .album-desc-dot {
    color: #666;
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal;
    p {
      text-indent: 2em;
      line-height: 24px;
      margin-top: 4px;
    }
  }
}
</style>