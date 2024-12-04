<template>
    <div class="cover">
        <img :src="`${playlist?.coverImgUrl}?param=150y150`" alt="">
        <span class="msk"></span>
    </div>
    <div class="cnt">
        <div class="m-info">
            <div class="hd">
                <h2>{{playlist?.name}}</h2>
            </div>
            <div class="user">
                <i class="u-icn"></i>
                <span class="time">最近更新：{{formatDateTime(playlist?.updateTime / 1000, 'M月D日')}}</span>
                <!-- <span>（更新72首）</span> -->
            </div>
            <div class="btns">
                <span class="btns-bag" :class="playlist?.trackCount ? 'play' : 'disable-play'" title="播放"  @click="PlayListBtn">
                    <i class="i-box btns-bag">
                        <i class="play-icn btns-bag"></i>
                        播放
                    </i>
                </span>
                <span v-show="playlist?.trackCount" class="add btns-bag" title="添加到播放列表" @click="addPlayListBtn"></span>
                <span class="btns-bag btn-jointly" :class="!isLogin ? 'collect' : 'disable-collect'" @click="collectSongList">
                    <i class="collect-icn icn btns-bag">{{playlist?.subscribedCount ? '(' + playlist?.subscribedCount + ')' : '收藏'}}</i>
                </span>
                <span class="btns-bag btn-jointly" :class="playlist?.trackCount ? 'share' : 'disable-share'" @click="notFeatureTip">
                    <i class="share-icn icn btns-bag">{{playlist?.shareCount ? '(' + playlist?.shareCount + ')' : '分享'}}</i>
                </span>
                <span class="btns-bag btn-jointly" :class="playlist?.trackCount ? 'down' : 'disable-down'" @click="notFeatureTip">
                    <i class="down-icn icn btns-bag">下载</i>
                </span>
                <span class="btns-bag btn-jointly" :class="playlist?.trackCount ? 'review' : 'disable-review'" @click="jumpToComment">
                    <i class="review-icn icn btns-bag">{{playlist?.commentCount ? '(' + playlist?.commentCount + ')' : '评论'}}</i>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDateTime } from '@/utils/utils';
import type { songType } from '@/hooks/methods/songFormat.ts';
import usePlayStore from '@/stores/modules/play.ts';
import useSongAddPlaylist from '@/hooks/useSongAddPlayList.ts';
import usePlaySong from '@/hooks/usePlaySong.ts';
import useUserStore from '@/stores/modules/user.ts';

const props = defineProps({
    playlist: {
        type: Object,
        default: {}
    },
    privileges: {
        type: Array,
        default: []
    }
})

const emit = defineEmits(['jumpToComment', 'notFeatureTip'])

const playStore = usePlayStore();
const userStore = useUserStore();

// 播放显示/隐藏
const lock = computed(() => playStore.getplayLock);

const isLogin = computed(() => userStore.getIsLogin);

// 添加到播放列表
let timer = null;
function addPlayListBtn(): boolean | undefined {
    if (props.playlist?.tracks?.length === 0) {
        return;
    }

    // 过滤无版权
    const songList: songType[] = props.playlist?.tracks.filter(
        (item: { id: number }) => !isCopyright(item.id)
    );

    // 将歌曲添加到播放列表
    useSongAddPlaylist(songList)

    playStore.setAddPlayListTip(true)
    playStore.setAddPlayListTipText('已添加到播放列表')
    if(!lock.value){
        playStore.setPlayLock(true)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
        playStore.setPlayLock(false)
        playStore.setAddPlayListTip(false)
    }, 1500)
}

// 播放列表歌曲
function PlayListBtn(): boolean | undefined {
    if (props.playlist?.tracks?.length === 0) {
        return;
    }

    // 过滤无版权
    const songList: songType[] = props.playlist?.tracks.filter(
        (item: { id: number }) => !isCopyright(item.id)
    );

    // 将歌曲添加到播放列表 - 清空当前播放列表
    useSongAddPlaylist(songList, {clear: true})
    // 播放第一首歌
    usePlaySong(songList[0])

    playStore.setAddPlayListTip(true)
    playStore.setAddPlayListTipText('已开始播放')
    if(!lock.value){
        playStore.setPlayLock(true)
    }
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
        playStore.setPlayLock(false)
        playStore.setAddPlayListTip(false)
    }, 1500)
}

// 歌曲是否有版权
function isCopyright(id: number): boolean | undefined {
  const privilege: {cp?: number} = props.privileges?.find(
    (item: { id: number }) => item.id === id
  );

  if (privilege?.cp === 0) {
    return true;
  }

  return false;
}

// 收藏歌单
function collectSongList(): Boolean {
    if(isLogin.value) {
        return false;
    }
    
}

function jumpToComment() {
    if(!props.playlist?.trackCount) {
        return false;
    }
    emit('jumpToComment')
}

function notFeatureTip() {
    if(!props.playlist?.trackCount) {
        return false;
    }
    emit('notFeatureTip', {type: 0, text: '功能暂未开发'})
}
</script>

<style lang="scss" scoped>
.cover{
    float: left;
    position: relative;
    margin: 0 -220px 0 0;
    padding: 3px;
    border: 1px solid #ccc;
    width: 150px;
    height: 150px;
    img{
        width: 150px;
        height: 150px;
    }
    .msk{
        width: 150px;
        height: 150px;
        background: url('@/assets/images/home/name-D5CGUEo8.png') no-repeat;
        background-position: -230px -380px;
        position: absolute;
        top: 3px;
        left: 3px;
    }
}
.cnt{
    width: 100%;
    float: right;
}
.m-info{
    margin-left: 187px;
    .hd{
        margin: 16px 0 4px;
        position: relative;
        line-height: 24px;
        h2{
            line-height: 24px;
            font-size: 20px;
            font-weight: normal;
            font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
        }
        &:after{
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;
        }
    }
    .user{
        margin: 0 0 20px;
        line-height: 35px;
        color: #999;
        font-family: Arial, Helvetica, sans-serif;
        .u-icn{
            float: left;
            margin: 9px 0 0 3px;
            width: 13px;
            height: 13px;
            overflow: hidden;
            vertical-align: middle;
            background: url('@/assets/images/icon.png') no-repeat;
            background-position: -18px -682px;
        }
        .time{
            margin-left: 5px;
            color: #666;
        }
        &:after{
            clear: both;
            content: '.';
            display: block;
            height: 0;
            visibility: hidden;
        }
    }
    .btns{
        width: 100%;
        height: 31px;
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        .btns-bag{
            background: url('@/assets/images/login/button-bag.png') no-repeat;
        }
        .play{
            padding: 0 5px 0 0;
            line-height: 29px;
            white-space: nowrap;
            overflow: hidden;
            text-align: center;
            cursor: pointer;
            color: #fff;
            background-position: right -428px;
            .i-box{
                display: inline-block;
                height: 31px;
                line-height: 29px;
                padding: 0 7px 0 8px;
                background-position: 0 -387px;
                .play-icn{
                    display: inline-block;
                    vertical-align: top;
                    width: 20px;
                    height: 18px;
                    margin: 6px 2px 2px 0;
                    background-position: 0 -1622px;
                    overflow: hidden;
                }
            }
            &:hover{
                color: #fff;
                background-position: right -510px;
                .i-box{
                    background-position: 0 -469px;
                }
                .play-icn{
                    background-position: -28px -1622px;
                }
            }
        }
        .add{
            margin-right: 5px;
            font-family: simsun, \5b8b\4f53;
            width: 31px;
            margin-left: -3px;
            height: 31px;
            line-height: 30px;
            min-width: 23px;
            cursor: pointer;
            background-position: 0 -1588px;
            &:hover{
                background-position: -40px -1588px;
            }
        }
        .disable-play{
            width: 67px;
            margin-right: 8px;
            color: #bebebe;
            cursor: default;
            background-position: right -934px;
            .i-box{
                display: inline-block;
                height: 31px;
                line-height: 29px;
                padding: 0 7px 0 8px;
                color: #bebebe;
                background-position: 0 -891px;
                cursor: default;
                .play-icn{
                    display: inline-block;
                    vertical-align: top;
                    width: 20px;
                    height: 18px;
                    margin: 6px 2px 2px 0;
                    background-position: 0 9999px;
                    overflow: hidden;
                }
            }
        }
        .btn-jointly{
            margin-right: 6px;
            font-family: simsun, \5b8b\4f53;
            color: #333;
            padding: 0 5px 0 0;
            white-space: nowrap;
            cursor: pointer;
            .icn{
                display: inline-block;
                height: 31px;
                line-height: 30px;
                min-width: 23px;
                padding-right: 2px;
                padding-left: 28px;
            }
        }
        .collect{
            background-position: right -1020px;
            .collect-icn{
                background-position: 0 -977px;
            }
            &:hover{
                background-position: right -1106px;
                .collect-icn{
                    background-position: 0 -1063px;
                }
            }
        }
        .share{
            background-position: right -1020px;
            .share-icn{
                background-position: 0 -1225px;
            }
            &:hover{
                background-position: right -1106px;
                .share-icn{
                    background-position: 0 -1268px;
                }
            }
        }
        .down{
            background-position: right -1020px;
            .down-icn{
                background-position: 0 -2761px;
            }
            &:hover{
                background-position: right -1106px;
                .down-icn{
                    background-position: 0 -2805px;
                }
            }
        }
        .review{
            background-position: right -1020px;
            .review-icn{
                background-position: 0 -1465px;
            }
            &:hover{
                background-position: right -1106px;
                .review-icn{
                    background-position: 0 -1508px;
                }
            }
        }
        .disable-collect{
            color: #bebebe;
            background-position: right -1192px;
            cursor: default;
            .collect-icn{
                color: #bebebe;
                background-position: 0 -1149px;
            }
        }
        .disable-share{
            color: #bebebe;
            background-position: right -1192px;
            cursor: default;
            .share-icn{
                color: #bebebe;
                background-position: 0 -1311px;
            }
        }
        .disable-down{
            color: #bebebe;
            background-position: right -1192px;
            cursor: default;
            .down-icn{
                color: #bebebe;
                background-position: 0 -3024px;
            }
        }
        .disable-review{
            color: #bebebe;
            background-position: right -1192px;
            cursor: default;
            .review-icn{
                color: #bebebe;
                background-position: 0 -1551px;
            }
        }
    }
}
</style>